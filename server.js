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

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Submit application
app.post('/api/submit-application', upload.single('resume'), (req, res) => {
    try {
        const applicationData = JSON.parse(req.body.applicationData);
        
        const application = {
            id: 'APP-' + Date.now().toString(36).toUpperCase(),
            ...applicationData,
            resume: req.file ? {
                filename: req.file.filename,
                originalName: req.file.originalname,
                size: req.file.size,
                path: req.file.path
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