const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = './uploads';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /pdf|doc|docx/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only PDF, DOC, and DOCX files are allowed'));
        }
    }
});

// Store applications in memory (use database in production)
let applications = [];

// Load existing applications from file on startup
try {
    if (fs.existsSync('./applications.json')) {
        const data = fs.readFileSync('./applications.json', 'utf8');
        applications = JSON.parse(data);
        console.log(`Loaded ${applications.length} existing applications from file`);
    }
} catch (error) {
    console.error('Error loading applications from file:', error);
    applications = [];
}

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Submit application
app.post('/api/submit-application', upload.fields([
    { name: 'resume', maxCount: 1 },
    { name: 'transcript', maxCount: 1 },
    { name: 'coverLetter', maxCount: 1 }
]), (req, res) => {
    try {
        const applicationData = JSON.parse(req.body.applicationData);
        
        const application = {
            id: 'APP-' + Date.now().toString(36).toUpperCase(),
            ...applicationData,
            resume: req.files?.resume?.[0] ? {
                filename: req.files.resume[0].filename,
                originalName: req.files.resume[0].originalname,
                size: req.files.resume[0].size,
                path: req.files.resume[0].path
            } : null,
            transcript: req.files?.transcript?.[0] ? {
                filename: req.files.transcript[0].filename,
                originalName: req.files.transcript[0].originalname,
                size: req.files.transcript[0].size,
                path: req.files.transcript[0].path
            } : null,
            coverLetter: req.files?.coverLetter?.[0] ? {
                filename: req.files.coverLetter[0].filename,
                originalName: req.files.coverLetter[0].originalname,
                size: req.files.coverLetter[0].size,
                path: req.files.coverLetter[0].path
            } : null,
            submissionTime: new Date(),
            status: 'submitted'
        };
        
        applications.push(application);
        
        // Save to file for persistence
        fs.writeFileSync('./applications.json', JSON.stringify(applications, null, 2));
        
        res.json({
            success: true,
            applicationId: application.id,
            message: 'Application submitted successfully'
        });
        
    } catch (error) {
        console.error('Error submitting application:', error);
        res.status(500).json({
            success: false,
            message: 'Error submitting application'
        });
    }
});

// Get all applications (admin endpoint)
app.get('/api/applications', (req, res) => {
    res.json(applications);
});

// Download all applications as JSON file
app.get('/api/download-applications', (req, res) => {
    const exportData = {
        exportInfo: {
            exportDate: new Date().toISOString(),
            totalApplications: applications.length,
            exportedBy: 'Server API',
            version: '1.0'
        },
        applications: applications.map(app => ({
            applicationId: app.id,
            submissionTime: app.submissionTime,
            status: app.status,
            
            // Account Information (including password)
            accountInfo: {
                email: app.user?.email || 'N/A',
                password: app.user?.password || 'N/A',
                accountCreated: app.user?.signupTime || app.user?.createdAt || 'N/A'
            },
            
            // Personal Information
            personalInfo: {
                firstName: app.formData?.firstName || 'N/A',
                lastName: app.formData?.lastName || 'N/A',
                phone: app.formData?.phone || 'N/A',
                linkedin: app.formData?.linkedin || 'N/A',
                github: app.formData?.github || 'N/A'
            },
            
            // Complete Address
            address: {
                unitNumber: app.formData?.unitNumber || 'N/A',
                streetAddress: app.formData?.streetAddress || 'N/A',
                city: app.formData?.city || 'N/A',
                country: app.formData?.country || 'N/A',
                pinCode: app.formData?.pinCode || 'N/A',
                fullAddress: [
                    app.formData?.unitNumber,
                    app.formData?.streetAddress,
                    app.formData?.city,
                    app.formData?.country,
                    app.formData?.pinCode
                ].filter(Boolean).join(', ')
            },
            
            // Work Experience
            workExperience: {
                jobTitle: app.formData?.jobTitle1 || 'N/A',
                company: app.formData?.company1 || 'N/A',
                location: app.formData?.location1 || 'N/A',
                currentlyWorking: app.formData?.currentWork1 ? 'Yes' : 'No',
                startDate: app.formData?.fromDate1 || 'N/A',
                endDate: app.formData?.toDate1 || (app.formData?.currentWork1 ? 'Present' : 'N/A'),
                roleDescription: app.formData?.roleDescription1 || 'N/A'
            },
            
            // Resume Information
            resume: {
                uploaded: app.resume ? 'Yes' : 'No',
                fileName: app.resume?.originalName || 'N/A',
                fileSize: app.resume?.size ? `${(app.resume.size / 1024).toFixed(1)} KB` : 'N/A',
                serverFileName: app.resume?.filename || 'N/A',
                downloadUrl: app.resume ? `/uploads/${app.resume.filename}` : 'N/A'
            },
            
            // Transcript Information
            transcript: {
                uploaded: app.transcript ? 'Yes' : 'No',
                fileName: app.transcript?.originalName || 'N/A',
                fileSize: app.transcript?.size ? `${(app.transcript.size / 1024).toFixed(1)} KB` : 'N/A',
                serverFileName: app.transcript?.filename || 'N/A',
                downloadUrl: app.transcript ? `/uploads/${app.transcript.filename}` : 'N/A'
            },
            
            // Cover Letter Information
            coverLetter: {
                uploaded: app.coverLetter ? 'Yes' : 'No',
                fileName: app.coverLetter?.originalName || 'N/A',
                fileSize: app.coverLetter?.size ? `${(app.coverLetter.size / 1024).toFixed(1)} KB` : 'N/A',
                serverFileName: app.coverLetter?.filename || 'N/A',
                downloadUrl: app.coverLetter ? `/uploads/${app.coverLetter.filename}` : 'N/A'
            },
            
            // Application Questions
            applicationQuestions: {
                meetsBasicRequirements: app.formData?.basicRequirements || 'N/A',
                workAuthorization: app.formData?.workAuthorized || 'N/A',
                sponsorshipRequired: app.formData?.sponsorshipRequired || 'N/A',
                optTraining: app.formData?.optTraining || 'N/A',
                yearsOfExperience: app.formData?.yearsExperience || 'N/A',
                previousDIceEmployee: app.formData?.previousKLA || 'N/A',
                backgroundCheckConsent: app.formData?.backgroundCheck || 'N/A'
            },
            
            // Behavioral Assessment
            behavioralAssessment: {
                passion: app.formData?.passion || 'N/A',
                workingWithDifficultPeople: app.formData?.difficultPeople || 'N/A',
                timeManagement: app.formData?.timeManagement || 'N/A',
                overcomingChallengesAndSetbacks: app.formData?.resilienceType || 'N/A'
            },
            
            // Voluntary Disclosures
            voluntaryDisclosures: {
                veteranStatus: app.formData?.veteranStatus || 'N/A',
                gender: app.formData?.gender || 'N/A',
                hispanic: app.formData?.hispanic || 'N/A',
                race: app.formData?.race || 'N/A',
                consentToTerms: app.formData?.consentTerms ? 'Yes' : 'No'
            },
            
            // Self-Identification (Disability)
            disabilityInfo: {
                language: app.formData?.language || 'N/A',
                disabilityName: app.formData?.disabilityName || 'N/A',
                disabilityDate: app.formData?.disabilityDate || 'N/A',
                disabilityStatus: app.formData?.disabilityStatus || 'N/A',
                employeeId: app.formData?.employeeId || 'N/A'
            },
            
            // Raw form data (complete backup)
            rawFormData: app.formData || {},
            rawUserData: app.user || {}
        }))
    };

    // Set headers for file download
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="job-applications-export-${new Date().toISOString().split('T')[0]}.json"`);
    
    res.json(exportData);
});

// Get specific application
app.get('/api/applications/:id', (req, res) => {
    const application = applications.find(app => app.id === req.params.id);
    if (application) {
        res.json(application);
    } else {
        res.status(404).json({ message: 'Application not found' });
    }
});

// Serve uploaded files (resumes)
app.get('/uploads/:filename', (req, res) => {
    const filename = req.params.filename;
    const filepath = path.join(__dirname, 'uploads', filename);
    
    // Check if file exists
    if (fs.existsSync(filepath)) {
        res.sendFile(filepath);
    } else {
        res.status(404).json({ message: 'File not found' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log('Job Application System is ready!');
});