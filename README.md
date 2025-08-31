# Job Application System

A comprehensive job application website similar to Workday, specifically designed for software engineer positions. This system includes user authentication, resume upload, detailed application forms, and complete data collection.

## Features

### 🔐 Authentication System
- User login and signup functionality
- Session management
- Secure form access

### 📄 Resume Upload
- Drag and drop file upload
- Support for PDF, DOC, and DOCX formats
- File size validation (5MB max)
- File type validation

### 📋 Comprehensive Application Form
- **Personal Information**: Name, contact details, social profiles
- **Work Authorization**: US work eligibility and sponsorship requirements
- **Professional Experience**: Years of experience, current role, salary expectations
- **Technical Skills**: Programming languages, frameworks, databases, cloud platforms
- **Availability**: Start date, work arrangement preferences, relocation willingness
- **Additional Questions**: Motivation, project experience, technical strengths
- **Diversity & Inclusion**: Optional demographic information

### 📊 Application Review & Submission
- Complete application review before submission
- Edit functionality
- Application ID generation
- Success confirmation

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js, Express.js
- **File Upload**: Multer
- **Styling**: Modern CSS with gradients and animations
- **Responsive**: Mobile-friendly design

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Server**
   ```bash
   npm start
   ```
   
   For development with auto-restart:
   ```bash
   npm run dev
   ```

3. **Access the Application**
   Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Usage

### For Applicants

1. **Login/Signup**: Create an account or login with existing credentials
2. **Upload Resume**: Drag and drop or browse to upload your resume
3. **Fill Application**: Complete all required sections of the application form
4. **Review**: Review all entered information before submission
5. **Submit**: Submit your application and receive a confirmation ID

### For Administrators

- **View Applications**: Access `/api/applications` to see all submitted applications
- **Individual Application**: Access `/api/applications/{id}` for specific application details

## File Structure

```
job-application-system/
├── index.html          # Main HTML file with all sections
├── styles.css          # Complete styling and responsive design
├── script.js           # Frontend JavaScript functionality
├── server.js           # Backend Express server
├── package.json        # Node.js dependencies and scripts
├── README.md           # This file
├── uploads/            # Directory for uploaded resumes (created automatically)
└── applications.json   # Stored application data (created automatically)
```

## API Endpoints

- `GET /` - Serve the main application
- `POST /api/submit-application` - Submit a new application with resume
- `GET /api/applications` - Get all applications (admin)
- `GET /api/applications/:id` - Get specific application by ID

## Data Collection

The system collects comprehensive information including:

- Personal and contact information
- Professional background and experience
- Technical skills and expertise
- Work authorization status
- Salary expectations
- Availability and preferences
- Detailed responses to role-specific questions
- Optional diversity and inclusion data

All collected data is stored securely and can be exported for review by hiring teams.

## Security Features

- File type and size validation
- Input sanitization
- CORS protection
- Secure file upload handling

## Customization

The system is highly customizable:

- **Styling**: Modify `styles.css` for different branding
- **Questions**: Update form fields in `index.html`
- **Validation**: Adjust validation rules in `script.js`
- **Backend**: Extend API endpoints in `server.js`

## Production Deployment

For production use:

1. Use a proper database (PostgreSQL, MongoDB)
2. Implement proper authentication (JWT, OAuth)
3. Add email notifications
4. Set up file storage (AWS S3, Google Cloud Storage)
5. Add proper logging and monitoring
6. Implement rate limiting
7. Use HTTPS

## License

MIT License - feel free to use and modify for your needs.