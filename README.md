# HireFlow AI

HireFlow AI is a full-stack AI-powered Job Portal and Applicant Tracking System (ATS) built using the MERN stack.

The platform provides separate workflows for candidates and recruiters. Candidates can discover and apply for jobs, upload resumes, track applications, and receive AI-based job recommendations. Recruiters can create and manage jobs, review applications, analyze resumes, rank candidates, and shortlist or reject applicants.

---

## 🚀 Features

### 👨‍💼 Candidate Features

- Candidate registration and login
- Browse available jobs
- Search and view job details
- Apply for jobs
- Upload resume
- View submitted applications
- View application details
- Track application status
- AI-powered job recommendations
- Resume-to-job matching

### 🏢 Recruiter Features

- Recruiter registration and login
- Recruiter dashboard
- Create job postings
- View posted jobs
- Edit job postings
- Delete job postings
- View applications for each job
- View candidate details
- Download candidate resumes
- Update application status
- Shortlist or reject candidates
- Application statistics

### 🤖 AI & ATS Features

- AI-powered resume analysis
- Resume scoring
- Resume strengths and weaknesses
- Matched skills identification
- Missing skills identification
- Experience analysis
- AI hiring recommendation
- AI candidate ranking
- AI-based job matching
- ATS resume analysis

---

## 🛠️ Tech Stack

### Frontend

- React.js
- JavaScript
- React Router
- Axios
- Bootstrap
- HTML5
- CSS3
- Vite

### Backend

- Node.js
- Express.js
- REST APIs
- JWT Authentication
- Multer
- Express Middleware

### Database

- MongoDB
- MongoDB Atlas
- Mongoose

### AI

- Google Gemini API

### Development Tools

- Git
- GitHub
- VS Code
- Postman

---

## 📁 Project Structure

```text
HireFlow-AI/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── candidate/
│   │   │   └── common/
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   ├── candidate/
│   │   │   ├── common/
│   │   │   └── recruiter/
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── applicationController.js
│   │   ├── authController.js
│   │   └── jobController.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   ├── rateLimiter.js
│   │   ├── roleMiddleware.js
│   │   ├── uploadMiddleware.js
│   │   └── validationMiddleware.js
│   │
│   ├── models/
│   │   ├── Application.js
│   │   ├── Job.js
│   │   └── User.js
│   │
│   ├── routes/
│   │   ├── applicationRoutes.js
│   │   ├── authRoutes.js
│   │   └── jobRoutes.js
│   │
│   ├── utils/
│   │   ├── atsAnalyzer.js
│   │   └── jobMatcher.js
│   │
│   ├── app.js
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md
