# 🎓 ElevateConnect Platform

**Smart TPO System** - Placement Drive Management with Growth Loop

## 🚀 Features

- **JWT Authentication** - Secure user management
- **Role-Based Access** - Student, TPO, Alumni, Admin
- **Placement Drives** - Post and manage opportunities
- **Application Tracking** - Real-time status updates
- **Growth Loop** - Feedback → Certification → Re-eligibility
- **Student Profiles** - CGPA, skills, and academic tracking

## 🛠️ Tech Stack

**Backend:**
- Java 17
- Spring Boot 3.2.2
- Spring Security + JWT
- MySQL 8
- Hibernate/JPA

**Frontend:**
- HTML/CSS/JavaScript
- Responsive UI
- REST API Integration

## 📦 Setup

### Prerequisites
- JDK 17
- MySQL 8
- Maven 3.9+

### Backend Setup

1. **Configure Database** in `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/elevate_connect?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
```

2. **Run Backend:**
```bash
cd backend
mvn spring-boot:run
```

Server starts on `http://localhost:8081`

### Frontend Setup

Simply open in browser:
```
frontend/register.html
```

## 🧪 Testing

1. **Create TPO Account** - Email: tpo@college.edu
2. **Create Student Account** - Email: student@college.edu, CGPA: 8.5
3. **Post a Drive** (TPO)
4. **Apply to Drive** (Student)
5. **Test Growth Loop** - Reject → Feedback → Certificate → Verify

See `MANUAL_TEST_GUIDE.md` for detailed testing steps.

## 📊 Database Schema

- `users` - User accounts
- `student_profiles` - Academic details
- `drives` - Placement opportunities
- `applications` - Student applications
- `feedbacks` - TPO feedback with course recommendations
- `certifications` - Course completion proofs

## 🔒 Security

- JWT-based authentication
- Role-based authorization (`@PreAuthorize`)
- CORS configured for frontend
- BCrypt password encryption

## 📝 API Endpoints

**Authentication:**
- `POST /api/auth/register` - Create account
- `POST /api/auth/authenticate` - Login

**Student:**
- `GET /api/student/eligible-drives` - View available drives
- `POST /api/student/apply/{driveId}` - Apply to drive
- `GET /api/student/my-applications` - View applications
- `GET /api/student/my-feedback` - View feedback
- `POST /api/student/upload-certificate` - Submit certificate

**TPO:**
- `POST /api/tpo/drives` - Create drive
- `GET /api/tpo/drives` - List all drives
- `GET /api/tpo/applications/{driveId}` - View applicants
- `PUT /api/tpo/applications/{id}/status` - Update status
- `POST /api/tpo/feedback` - Assign feedback
- `PUT /api/tpo/certifications/{id}/verify` - Verify certificate

## 🎯 Growth Loop Workflow

```
Student Applies → TPO Rejects + Feedback → 
Student Views Feedback → Student Uploads Certificate → 
TPO Verifies Certificate → Student Re-eligible ✅
```

## 👥 Contributors

Created for Smart TPO System project

## 📄 License

MIT License
