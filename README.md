# Learning Management System (LMS)

A comprehensive Learning Management System built as a Progressive Web App with modern web technologies.

## Features

- **User Authentication**: Support for Students, Teachers, and Admins with JWT-based authentication
- **Course Management**: Create, manage, and enroll in courses
- **Assignment System**: Create assignments, submit work, and grade submissions
- **Grading System**: Teachers can grade student submissions with feedback
- **Discussion Forums**: Course-specific discussion boards with comments
- **Role-Based Access Control**: Different dashboards and permissions for each user role
- **Azure Deployment Ready**: Pre-configured for Azure App Service and Azure Database

## Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: express-validator

### Frontend
- **Framework**: Next.js 14 (React 18)
- **Language**: TypeScript
- **Styling**: CSS-in-JS (inline styles)
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form

## Project Structure

```
.
├── backend/
│   ├── prisma/
│   │   └── schema.prisma          # Database schema
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts        # Prisma client
│   │   ├── controllers/           # Request handlers
│   │   │   ├── authController.ts
│   │   │   ├── courseController.ts
│   │   │   ├── assignmentController.ts
│   │   │   └── discussionController.ts
│   │   ├── middleware/
│   │   │   └── auth.ts            # Authentication middleware
│   │   ├── routes/                # API routes
│   │   │   ├── auth.ts
│   │   │   ├── courses.ts
│   │   │   ├── assignments.ts
│   │   │   └── discussions.ts
│   │   └── index.ts               # Express app entry
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── app/                   # Next.js app directory
│   │   │   ├── dashboard/
│   │   │   │   ├── student/
│   │   │   │   ├── teacher/
│   │   │   │   └── admin/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── lib/                   # Utilities
│   │   │   ├── api.ts
│   │   │   └── auth.ts
│   │   └── types/                 # TypeScript types
│   │       └── index.ts
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── .azure/                        # Azure deployment templates
│   ├── azuredeploy.json
│   └── azuredeploy.parameters.json
│
├── .github/
│   └── workflows/
│       └── azure-deploy.yml       # CI/CD pipeline
│
├── docs/                          # Documentation
│   ├── API.md
│   ├── DEPLOYMENT.md
│   └── DEVELOPMENT.md
│
├── docker-compose.yml             # Local development setup
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- Git

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/intelleximus-xyz/Learing-Management-System.git
   cd Learing-Management-System
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   
   # Copy environment variables
   cp .env.example .env
   
   # Update .env with your database credentials
   # DATABASE_URL="postgresql://username:password@localhost:5432/lms_db?schema=public"
   
   # Run database migrations
   npx prisma migrate dev
   
   # Generate Prisma client
   npx prisma generate
   
   # Start development server
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   
   # Copy environment variables
   cp .env.example .env
   
   # Update .env with your backend URL
   # NEXT_PUBLIC_API_URL=http://localhost:5000/api
   
   # Start development server
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - API Health Check: http://localhost:5000/health

### Using Docker Compose

For a quick setup with Docker:

```bash
docker-compose up -d
```

This will start:
- PostgreSQL database on port 5432
- Backend API on port 5000
- Frontend on port 3000

## User Roles

### Student
- View enrolled courses
- Submit assignments
- Participate in discussions
- View grades and feedback

### Teacher
- Create and manage courses
- Create assignments
- Grade student submissions
- Moderate discussions

### Admin
- View all courses and users
- Manage system-wide settings
- Access all features

## API Documentation

See [docs/API.md](docs/API.md) for detailed API documentation.

## Deployment

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for Azure deployment instructions.

## Development Guide

See [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) for development best practices.

## Database Schema

The application uses PostgreSQL with the following main entities:

- **User**: Students, Teachers, and Admins
- **Course**: Courses created by teachers
- **Enrollment**: Student-course relationships
- **Assignment**: Course assignments
- **Submission**: Student assignment submissions
- **Discussion**: Course discussion threads
- **Comment**: Discussion comments

## Security

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- SQL injection prevention via Prisma ORM
- CORS configuration
- Environment variable protection

## License

BSD 3-Clause License - see LICENSE file for details

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

For issues and questions, please open an issue on GitHub.
