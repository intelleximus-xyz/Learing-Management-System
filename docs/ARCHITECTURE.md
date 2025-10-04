# Architecture Overview

## System Architecture

The Learning Management System follows a modern three-tier architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│                    (Next.js + React)                         │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Login   │  │Dashboard │  │ Courses  │  │ Assign.  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────┬───────────────────────────────────────┘
                      │ HTTP/REST API
                      │ (JWT Auth)
┌─────────────────────▼───────────────────────────────────────┐
│                      Backend API                             │
│                 (Express.js + TypeScript)                    │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   Auth   │  │ Courses  │  │Assignmt  │  │ Discuss. │   │
│  │ Routes   │  │ Routes   │  │ Routes   │  │ Routes   │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
│       │             │              │              │         │
│  ┌────▼─────────────▼──────────────▼──────────────▼─────┐  │
│  │              Controllers Layer                        │  │
│  └────┬──────────────────────────────────────────────────┘  │
│       │                                                     │
│  ┌────▼──────────────────────────────────────────────────┐  │
│  │         Authentication Middleware                     │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────┬───────────────────────────────────────┘
                      │ Prisma ORM
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                      Database                                │
│                     (PostgreSQL)                             │
│                                                              │
│  ┌──────┐  ┌──────┐  ┌────────┐  ┌────────┐  ┌────────┐  │
│  │Users │  │Course│  │Enrollmt│  │Assignmt│  │Discuss.│  │
│  └──────┘  └──────┘  └────────┘  └────────┘  └────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18
- **Language**: TypeScript
- **HTTP Client**: Axios
- **State Management**: React Hooks (useState, useEffect)
- **Styling**: CSS-in-JS (Inline Styles)
- **Routing**: Next.js File-based Routing

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **ORM**: Prisma
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: express-validator
- **Security**: bcryptjs for password hashing, CORS

### Database
- **DBMS**: PostgreSQL 14+
- **Schema Management**: Prisma Migrate
- **Client**: Prisma Client

### DevOps
- **Containerization**: Docker & Docker Compose
- **Cloud Platform**: Microsoft Azure
- **CI/CD**: GitHub Actions
- **Infrastructure as Code**: Azure ARM Templates

## Data Models

### User
```typescript
{
  id: UUID,
  email: String (unique),
  password: String (hashed),
  name: String,
  role: Enum (STUDENT, TEACHER, ADMIN),
  createdAt: DateTime,
  updatedAt: DateTime
}
```

### Course
```typescript
{
  id: UUID,
  title: String,
  description: String,
  code: String (unique),
  teacherId: UUID (FK -> User),
  createdAt: DateTime,
  updatedAt: DateTime
}
```

### Enrollment
```typescript
{
  id: UUID,
  userId: UUID (FK -> User),
  courseId: UUID (FK -> Course),
  enrolledAt: DateTime,
  UNIQUE(userId, courseId)
}
```

### Assignment
```typescript
{
  id: UUID,
  title: String,
  description: String,
  courseId: UUID (FK -> Course),
  dueDate: DateTime,
  maxGrade: Integer,
  createdAt: DateTime,
  updatedAt: DateTime
}
```

### Submission
```typescript
{
  id: UUID,
  assignmentId: UUID (FK -> Assignment),
  studentId: UUID (FK -> User),
  content: String,
  fileUrl: String (optional),
  status: Enum (PENDING, SUBMITTED, GRADED),
  grade: Integer (optional),
  feedback: String (optional),
  submittedAt: DateTime,
  gradedAt: DateTime (optional),
  UNIQUE(assignmentId, studentId)
}
```

### Discussion
```typescript
{
  id: UUID,
  title: String,
  content: String,
  courseId: UUID (FK -> Course),
  authorId: UUID (FK -> User),
  createdAt: DateTime,
  updatedAt: DateTime
}
```

### Comment
```typescript
{
  id: UUID,
  content: String,
  discussionId: UUID (FK -> Discussion),
  authorId: UUID (FK -> User),
  createdAt: DateTime,
  updatedAt: DateTime
}
```

## API Architecture

### Authentication Flow
```
1. User submits credentials
2. Backend validates credentials
3. Backend generates JWT token
4. Token sent to client
5. Client stores token in localStorage
6. Client includes token in Authorization header for protected routes
7. Backend middleware validates token
8. Backend authorizes based on user role
```

### Request/Response Flow
```
Client Request
    ↓
CORS Middleware
    ↓
Body Parser
    ↓
Route Handler
    ↓
Authentication Middleware (if protected)
    ↓
Authorization Middleware (if role-based)
    ↓
Validation Middleware
    ↓
Controller
    ↓
Prisma ORM
    ↓
PostgreSQL Database
    ↓
Response to Client
```

## Security Measures

1. **Authentication**: JWT-based stateless authentication
2. **Authorization**: Role-based access control (RBAC)
3. **Password Security**: bcrypt hashing with salt rounds
4. **SQL Injection Prevention**: Prisma ORM parameterized queries
5. **CORS**: Configured to allow only frontend origin
6. **Environment Variables**: Sensitive data in .env files
7. **HTTPS**: Enforced in production (Azure)
8. **Input Validation**: express-validator on all inputs

## Deployment Architecture (Azure)

```
┌─────────────────────────────────────────────────────┐
│                  Azure Cloud                         │
│                                                      │
│  ┌────────────────────────────────────────────┐    │
│  │         App Service Plan (B1/S1)            │    │
│  │                                             │    │
│  │  ┌──────────────┐    ┌──────────────┐     │    │
│  │  │   Frontend    │    │   Backend     │     │    │
│  │  │  App Service  │    │  App Service  │     │    │
│  │  │  (Node 18)    │    │  (Node 18)    │     │    │
│  │  └───────┬───────┘    └───────┬───────┘     │    │
│  └──────────┼──────────────────────┼────────────┘    │
│             │                      │                 │
│             │                      │                 │
│             │        ┌─────────────▼──────────┐     │
│             │        │  Azure Database for    │     │
│             │        │  PostgreSQL (Flexible) │     │
│             │        └────────────────────────┘     │
│             │                                       │
│  ┌──────────▼─────────────────────────────────┐    │
│  │        Application Insights               │    │
│  │         (Monitoring & Logging)            │    │
│  └──────────────────────────────────────────┘    │
│                                                    │
│  ┌─────────────────────────────────────────────┐  │
│  │           Azure Key Vault                   │  │
│  │          (Secrets Management)               │  │
│  └─────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────┘
```

## Scalability Considerations

### Horizontal Scaling
- Frontend and Backend can scale independently
- Azure App Service supports auto-scaling
- Stateless JWT authentication enables easy scaling

### Vertical Scaling
- App Service Plan can be upgraded (B1 → S1 → P1V2)
- Database tier can be upgraded for more resources

### Performance Optimization
- Database indexing on frequently queried fields
- Prisma connection pooling
- Next.js automatic code splitting
- Static asset caching via CDN (future)
- Redis caching for frequent queries (future)

## Future Enhancements

### Short Term
- File upload functionality for assignments
- Real-time notifications (WebSockets)
- Course materials and resources
- Student grade reports
- Calendar integration

### Medium Term
- Video conferencing integration
- Quiz and test functionality
- Learning analytics dashboard
- Mobile app (React Native)
- Email notifications

### Long Term
- AI-powered recommendations
- Plagiarism detection
- Advanced analytics and insights
- Multi-language support
- Third-party LTI integration

## Development Workflow

```
Developer
    ↓
Feature Branch
    ↓
Local Development
    ↓
Unit Tests (Future)
    ↓
Commit & Push
    ↓
GitHub Actions CI/CD
    ↓
Automated Build
    ↓
Automated Tests (Future)
    ↓
Deploy to Azure
    ↓
Production Environment
```

## Monitoring and Maintenance

### Logging
- Application logs via Azure App Service logs
- Database query logs via PostgreSQL
- Error tracking via Application Insights

### Monitoring
- Application Insights for performance metrics
- Azure Monitor for infrastructure metrics
- Custom alerts for critical issues

### Backup Strategy
- Daily automated database backups (7-day retention)
- App Service snapshot backups
- Code versioned in Git

### Disaster Recovery
- Database geo-replication (optional)
- Multi-region deployment (optional)
- Regular backup testing
