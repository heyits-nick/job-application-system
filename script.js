// Complete Workday-style Application JavaScript
let applicationData = {
    user: null,
    formData: {}
};

let currentStep = 1;

// DOM elements
const sections = {
    createAccount: document.getElementById('createAccountSection'),
    signin: document.getElementById('signinSection'),
    information: document.getElementById('informationSection'),
    experience: document.getElementById('experienceSection'),
    questions: document.getElementById('questionsSection'),
    disclosures: document.getElementById('disclosuresSection'),
    selfIdentify: document.getElementById('selfIdentifySection'),
    review: document.getElementById('reviewSection'),
    success: document.getElementById('successSection')
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    initializeExperienceHandlers();
    initializeTermsDropdown();
    showSection('createAccount');
    updateProgressSteps();
});

function initializeEventListeners() {
    console.log('Initializing event listeners...'); // Debug log
    
    // Navigation between sign up and sign in
    const signinLink = document.getElementById('showSignin');
    const signupLink = document.getElementById('showSignup');
    const signupForm = document.getElementById('signupForm');
    const loginForm = document.getElementById('loginForm');
    
    console.log('Elements found:', {
        signinLink: !!signinLink,
        signupLink: !!signupLink,
        signupForm: !!signupForm,
        loginForm: !!loginForm
    }); // Debug log
    
    signinLink?.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Switching to signin section');
        showSection('signin');
    });
    
    signupLink?.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Switching to createAccount section');
        showSection('createAccount');
    });
    
    // Form submissions
    signupForm?.addEventListener('submit', handleSignup);
    loginForm?.addEventListener('submit', handleLogin);
    document.getElementById('informationForm')?.addEventListener('submit', handleInformationSubmit);
    document.getElementById('experienceForm')?.addEventListener('submit', handleExperienceSubmit);
    document.getElementById('questionsForm')?.addEventListener('submit', handleQuestionsSubmit);
    document.getElementById('disclosuresForm')?.addEventListener('submit', handleDisclosuresSubmit);
    document.getElementById('selfIdentifyForm')?.addEventListener('submit', handleSelfIdentifySubmit);
    
    // Back buttons
    document.getElementById('backToAccount')?.addEventListener('click', () => goToStep(1));
    document.getElementById('backToInfo')?.addEventListener('click', () => goToStep(2));
    document.getElementById('backToExperience')?.addEventListener('click', () => goToStep(3));
    document.getElementById('backToQuestions')?.addEventListener('click', () => goToStep(4));
    document.getElementById('backToDisclosures')?.addEventListener('click', () => goToStep(5));
    document.getElementById('backToSelfIdentify')?.addEventListener('click', () => goToStep(6));
    
    // Final submission
    document.getElementById('submitApplication')?.addEventListener('click', handleFinalSubmit);
}

function showSection(sectionName) {
    // Hide all sections
    Object.values(sections).forEach(section => {
        if (section) section.classList.remove('active');
    });
    
    // Show target section
    if (sections[sectionName]) {
        sections[sectionName].classList.add('active');
    }
}

function updateProgressSteps() {
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
        const stepNumber = index + 1;
        step.classList.remove('active', 'completed');
        
        if (stepNumber < currentStep) {
            step.classList.add('completed');
        } else if (stepNumber === currentStep) {
            step.classList.add('active');
        }
    });
}

function goToStep(stepNumber) {
    currentStep = stepNumber;
    updateProgressSteps();
    
    const sectionMap = {
        1: 'createAccount',
        2: 'information',
        3: 'experience',
        4: 'questions',
        5: 'disclosures',
        6: 'selfIdentify',
        7: 'review'
    };
    
    showSection(sectionMap[stepNumber]);
}

function handleSignup(e) {
    e.preventDefault();
    console.log('Signup form submitted'); // Debug log
    
    const formData = new FormData(e.target);
    const email = formData.get('signupEmail');
    const password = formData.get('signupPassword');
    const confirmPassword = formData.get('confirmPassword');
    const agreeTerms = formData.get('agreeTerms');
    
    console.log('Signup data:', { email, password, confirmPassword, agreeTerms }); // Debug log
    
    // Validate password requirements
    if (!validatePassword(password)) {
        showNotification('Password does not meet requirements', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }
    
    if (!agreeTerms) {
        showNotification('Please agree to create an account', 'error');
        return;
    }
    
    if (email && password) {
        applicationData.user = { 
            email, 
            password,
            signupTime: new Date() 
        };
        currentStep = 2;
        updateProgressSteps();
        showSection('information');
        showNotification('Account created successfully!', 'success');
        console.log('Signup successful, moving to information section'); // Debug log
    } else {
        showNotification('Please fill in all required fields', 'error');
        console.log('Signup failed - missing fields'); // Debug log
    }
}

function handleLogin(e) {
    e.preventDefault();
    console.log('Login form submitted'); // Debug log
    
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    
    console.log('Email:', email, 'Password:', password); // Debug log
    
    if (email && password) {
        applicationData.user = { 
            email, 
            password,
            loginTime: new Date() 
        };
        currentStep = 2;
        updateProgressSteps();
        showSection('information');
        showNotification('Login successful!', 'success');
        console.log('Login successful, moving to information section'); // Debug log
    } else {
        showNotification('Please fill in all fields', 'error');
        console.log('Login failed - missing fields'); // Debug log
    }
}

function handleInformationSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    // Store form data
    for (let [key, value] of formData.entries()) {
        applicationData.formData[key] = value;
    }
    
    // Validate required fields (including address fields)
    const requiredFields = ['firstName', 'lastName', 'phone', 'unitNumber', 'streetAddress', 'city', 'country', 'pinCode'];
    const missingFields = requiredFields.filter(field => !applicationData.formData[field]);
    
    if (missingFields.length > 0) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    currentStep = 3;
    updateProgressSteps();
    showSection('experience');
    showNotification('Information saved successfully!', 'success');
}

function handleExperienceSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    // Store form data
    for (let [key, value] of formData.entries()) {
        applicationData.formData[key] = value;
    }
    
    // Validate resume upload
    const resumeFile = document.getElementById('resumeUpload').files[0];
    if (!resumeFile) {
        showNotification('Please upload your resume', 'error');
        return;
    }
    
    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (resumeFile.size > maxSize) {
        showNotification('Resume file size must be less than 5MB', 'error');
        return;
    }
    
    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(resumeFile.type)) {
        showNotification('Please upload a PDF, DOC, or DOCX file', 'error');
        return;
    }
    
    // Validate required fields
    const requiredFields = ['jobTitle1', 'company1'];
    const missingFields = requiredFields.filter(field => !applicationData.formData[field]);
    
    if (missingFields.length > 0) {
        showNotification('Please fill in all required work experience fields', 'error');
        return;
    }
    
    // Store resume file info
    applicationData.formData.resumeFileName = resumeFile.name;
    applicationData.formData.resumeFileSize = resumeFile.size;
    
    currentStep = 4;
    updateProgressSteps();
    showSection('questions');
    showNotification('Experience and resume saved successfully!', 'success');
}

function handleQuestionsSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    // Store form data
    for (let [key, value] of formData.entries()) {
        applicationData.formData[key] = value;
    }
    
    // Validate required fields (including behavioral questions)
    const requiredFields = [
        'basicRequirements', 'workAuthorized', 'sponsorshipRequired', 
        'optTraining', 'yearsExperience', 'previousKLA', 'backgroundCheck',
        'passion', 'difficultPeople', 'timeManagement', 'resilienceType'
    ];
    const missingFields = requiredFields.filter(field => !applicationData.formData[field]);
    
    if (missingFields.length > 0) {
        showNotification('Please answer all required questions including behavioral assessment questions', 'error');
        return;
    }
    
    currentStep = 5;
    updateProgressSteps();
    showSection('disclosures');
    showNotification('Questions saved successfully!', 'success');
}

function handleDisclosuresSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    // Store form data
    for (let [key, value] of formData.entries()) {
        applicationData.formData[key] = value;
    }
    
    // Validate required fields
    const requiredFields = ['veteranStatus', 'race', 'consentTerms'];
    const missingFields = requiredFields.filter(field => !applicationData.formData[field]);
    
    if (missingFields.length > 0) {
        showNotification('Please complete all required disclosure fields', 'error');
        return;
    }
    
    currentStep = 6;
    updateProgressSteps();
    showSection('selfIdentify');
    showNotification('Disclosures saved successfully!', 'success');
}

function handleSelfIdentifySubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    // Store form data
    for (let [key, value] of formData.entries()) {
        applicationData.formData[key] = value;
    }
    
    // Validate required fields
    const requiredFields = ['language', 'disabilityName', 'disabilityDate', 'disabilityStatus'];
    const missingFields = requiredFields.filter(field => !applicationData.formData[field]);
    
    if (missingFields.length > 0) {
        showNotification('Please complete all required self-identification fields', 'error');
        return;
    }
    
    currentStep = 7;
    updateProgressSteps();
    generateReview();
    showSection('review');
    showNotification('Self-identification saved successfully!', 'success');
}

async function handleFinalSubmit() {
    try {
        // Prepare complete application data
        const completeApplication = {
            user: applicationData.user,
            formData: applicationData.formData,
            submissionTime: new Date(),
            status: 'submitted'
        };
        
        // Create FormData for file upload
        const formData = new FormData();
        
        // Add application data as JSON string
        formData.append('applicationData', JSON.stringify(completeApplication));
        
        // Add resume file if it exists
        const resumeFile = document.getElementById('resumeUpload').files[0];
        if (resumeFile) {
            formData.append('resume', resumeFile);
        }
        
        // Submit to backend
        const response = await fetch('/api/submit-application', {
            method: 'POST',
            body: formData // Don't set Content-Type header, let browser set it for FormData
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Show application ID from server
            const applicationIdElement = document.getElementById('applicationId');
            if (applicationIdElement) {
                applicationIdElement.textContent = result.applicationId;
            }
            
            // Show success page
            showSection('success');
            
            showNotification('Application submitted successfully!', 'success');
            
            console.log('Application submitted successfully:', result);
        } else {
            throw new Error(result.message || 'Submission failed');
        }
        
    } catch (error) {
        console.error('Submission error:', error);
        showNotification('Error submitting application. Please try again.', 'error');
    }
}

function generateReview() {
    const reviewContent = document.getElementById('reviewContent');
    const data = applicationData.formData;
    
    const reviewHTML = `
        <div class="review-section">
            <h4>Personal Information</h4>
            <div class="review-item">
                <span class="review-label">Name:</span>
                <span class="review-value">${data.firstName || 'N/A'} ${data.lastName || 'N/A'}</span>
            </div>
            <div class="review-item">
                <span class="review-label">Email:</span>
                <span class="review-value">${applicationData.user?.email || 'N/A'}</span>
            </div>
            <div class="review-item">
                <span class="review-label">Phone:</span>
                <span class="review-value">${data.phone || 'N/A'}</span>
            </div>
            <div class="review-item">
                <span class="review-label">Location:</span>
                <span class="review-value">${data.location || 'N/A'}</span>
            </div>
        </div>
        
        <div class="review-section">
            <h4>Work Experience</h4>
            <div class="review-item">
                <span class="review-label">Current Role:</span>
                <span class="review-value">${data.jobTitle1 || 'N/A'}</span>
            </div>
            <div class="review-item">
                <span class="review-label">Company:</span>
                <span class="review-value">${data.company1 || 'N/A'}</span>
            </div>
            <div class="review-item">
                <span class="review-label">Years of Experience:</span>
                <span class="review-value">${data.yearsExperience || 'N/A'}</span>
            </div>
        </div>
        
        <div class="review-section">
            <h4>Work Authorization</h4>
            <div class="review-item">
                <span class="review-label">Authorized to work in US:</span>
                <span class="review-value">${data.workAuthorized === 'yes' ? 'Yes' : 'No'}</span>
            </div>
            <div class="review-item">
                <span class="review-label">Requires sponsorship:</span>
                <span class="review-value">${data.sponsorshipRequired === 'yes' ? 'Yes' : 'No'}</span>
            </div>
        </div>
        
        <div class="review-section">
            <h4>Voluntary Disclosures</h4>
            <div class="review-item">
                <span class="review-label">Veteran Status:</span>
                <span class="review-value">${data.veteranStatus || 'Not specified'}</span>
            </div>
            <div class="review-item">
                <span class="review-label">Gender:</span>
                <span class="review-value">${data.gender || 'Not specified'}</span>
            </div>
            <div class="review-item">
                <span class="review-label">Race:</span>
                <span class="review-value">${data.race || 'Not specified'}</span>
            </div>
        </div>
    `;
    
    reviewContent.innerHTML = reviewHTML;
}

function validatePassword(password) {
    const requirements = {
        length: password.length >= 8,
        numeric: /\d/.test(password),
        alphabetic: /[a-zA-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        uppercase: /[A-Z]/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    return Object.values(requirements).every(req => req);
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `workday-notification ${type}`;
    notification.textContent = message;
    
    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '12px 20px',
        borderRadius: '4px',
        color: 'white',
        fontWeight: '500',
        zIndex: '1000',
        opacity: '0',
        transform: 'translateX(100%)',
        transition: 'all 0.3s ease',
        fontSize: '14px',
        maxWidth: '300px'
    });
    
    // Set background color based on type
    const colors = {
        success: '#34a853',
        error: '#ea4335',
        info: '#4285f4'
    };
    notification.style.backgroundColor = colors[type] || colors.info;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Experience management functions
let experienceCounter = 1;

function initializeExperienceHandlers() {
    // Add experience button
    document.getElementById('addExperienceBtn')?.addEventListener('click', addNewExperience);
    
    // Initialize delete handlers for existing experiences
    initializeDeleteHandlers();
}

function addNewExperience() {
    experienceCounter++;
    const container = document.getElementById('experienceContainer');
    
    const newExperienceHTML = `
        <div class="work-experience-section fade-in" data-experience="${experienceCounter}">
            <div class="experience-header">
                <h4>Work Experience ${experienceCounter}</h4>
                <button type="button" class="delete-experience-btn" onclick="deleteExperience(${experienceCounter})">Delete</button>
            </div>
            
            <div class="form-field">
                <label for="jobTitle${experienceCounter}">Job Title *</label>
                <input type="text" id="jobTitle${experienceCounter}" name="jobTitle${experienceCounter}" required>
            </div>
            
            <div class="form-field">
                <label for="company${experienceCounter}">Company *</label>
                <input type="text" id="company${experienceCounter}" name="company${experienceCounter}" required>
            </div>
            
            <div class="form-field">
                <label for="location${experienceCounter}">Location</label>
                <input type="text" id="location${experienceCounter}" name="location${experienceCounter}">
            </div>
            
            <div class="checkbox-field">
                <input type="checkbox" id="currentWork${experienceCounter}" name="currentWork${experienceCounter}">
                <label for="currentWork${experienceCounter}">I currently work here</label>
            </div>
            
            <div class="date-range">
                <div class="form-field">
                    <label for="fromDate${experienceCounter}">From</label>
                    <input type="month" id="fromDate${experienceCounter}" name="fromDate${experienceCounter}">
                </div>
                <div class="form-field">
                    <label for="toDate${experienceCounter}">To</label>
                    <input type="month" id="toDate${experienceCounter}" name="toDate${experienceCounter}">
                </div>
            </div>
            
            <div class="form-field">
                <label for="roleDescription${experienceCounter}">Role Description</label>
                <textarea id="roleDescription${experienceCounter}" name="roleDescription${experienceCounter}" rows="4"></textarea>
            </div>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', newExperienceHTML);
    
    // Setup current work checkbox handler for new experience
    setupCurrentWorkHandler(experienceCounter);
    
    showNotification(`Work Experience ${experienceCounter} added`, 'success');
}

function deleteExperience(experienceNumber) {
    if (experienceNumber === 1) {
        showNotification('Cannot delete the first work experience', 'error');
        return;
    }
    
    const experienceElement = document.querySelector(`[data-experience="${experienceNumber}"]`);
    if (experienceElement) {
        experienceElement.classList.add('fade-out');
        setTimeout(() => {
            experienceElement.remove();
            showNotification(`Work Experience ${experienceNumber} deleted`, 'success');
        }, 300);
    }
}

function initializeDeleteHandlers() {
    // Setup current work checkbox handlers for existing experiences
    for (let i = 1; i <= experienceCounter; i++) {
        setupCurrentWorkHandler(i);
    }
}

function setupCurrentWorkHandler(experienceNumber) {
    const currentWorkCheckbox = document.getElementById(`currentWork${experienceNumber}`);
    const toDateField = document.getElementById(`toDate${experienceNumber}`);
    
    if (currentWorkCheckbox && toDateField) {
        currentWorkCheckbox.addEventListener('change', function() {
            if (this.checked) {
                toDateField.disabled = true;
                toDateField.value = '';
                toDateField.style.backgroundColor = '#f5f5f5';
            } else {
                toDateField.disabled = false;
                toDateField.style.backgroundColor = '';
            }
        });
    }
}

// Terms and Conditions dropdown functionality
function initializeTermsDropdown() {
    const termsToggle = document.getElementById('termsToggle');
    const termsContent = document.getElementById('termsContent');
    
    if (termsToggle && termsContent) {
        termsToggle.addEventListener('click', function() {
            const isExpanded = termsContent.classList.contains('expanded');
            
            if (isExpanded) {
                // Collapse
                termsContent.classList.remove('expanded');
                termsToggle.classList.remove('expanded');
                termsContent.style.display = 'none';
                termsToggle.querySelector('span').textContent = 'Click to view full Terms and Conditions';
            } else {
                // Expand
                termsContent.style.display = 'block';
                termsContent.classList.add('expanded');
                termsToggle.classList.add('expanded');
                termsToggle.querySelector('span').textContent = 'Click to hide Terms and Conditions';
            }
        });
    }
}