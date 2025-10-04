# Quick Start Guide

## Installation

1. Install dependencies for both backend and frontend:
   ```bash
   # Backend
   cd backend
   npm install
   
   # Frontend  
   cd ../frontend
   npm install
   ```

2. Set up environment variables:
   ```bash
   # Backend
   cd backend
   cp .env.example .env
   # Edit .env and update DATABASE_URL
   
   # Frontend
   cd ../frontend
   cp .env.example .env
   # Edit .env if needed
   ```

3. Set up the database:
   ```bash
   cd backend
   npx prisma migrate dev
   npx prisma generate
   ```

4. Run the application:
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev
   
   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

5. Open http://localhost:3000 in your browser

## Using Docker Compose

Alternatively, use Docker Compose for easy setup:

```bash
docker-compose up -d
```

Access the application at http://localhost:3000

## First Steps

1. Register a new user at http://localhost:3000/register
2. Select your role (Student, Teacher, or Admin)
3. Login and explore the dashboard

### As a Teacher
- Create courses from your dashboard
- Add assignments to courses
- Grade student submissions

### As a Student
- Enroll in available courses
- Submit assignments
- Participate in discussions

### As an Admin
- View all courses and users
- Manage system-wide settings

## Need Help?

- See [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) for detailed development guide
- See [docs/API.md](docs/API.md) for API documentation
- See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for deployment instructions
