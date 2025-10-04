# Development Guide

## Development Setup

### Environment Setup

1. **Install Dependencies**
   ```bash
   # Backend
   cd backend
   npm install
   
   # Frontend
   cd ../frontend
   npm install
   ```

2. **Configure Environment Variables**
   
   **Backend (.env):**
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/lms_db?schema=public"
   JWT_SECRET="your-secret-key-for-development"
   JWT_EXPIRES_IN="7d"
   PORT=5000
   NODE_ENV="development"
   FRONTEND_URL="http://localhost:3000"
   ```
   
   **Frontend (.env):**
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

3. **Setup Database**
   ```bash
   # Create PostgreSQL database
   createdb lms_db
   
   # Run migrations
   cd backend
   npx prisma migrate dev
   
   # Generate Prisma client
   npx prisma generate
   
   # (Optional) Seed database
   npx prisma db seed
   ```

## Development Workflow

### Running the Application

**Start Backend:**
```bash
cd backend
npm run dev
```
The backend will run on http://localhost:5000 with hot reload.

**Start Frontend:**
```bash
cd frontend
npm run dev
```
The frontend will run on http://localhost:3000 with hot reload.

### Database Management

**View Database:**
```bash
cd backend
npx prisma studio
```
This opens Prisma Studio at http://localhost:5555 for visual database management.

**Create Migration:**
```bash
cd backend
npx prisma migrate dev --name migration_name
```

**Reset Database:**
```bash
cd backend
npx prisma migrate reset
```

**Generate Prisma Client (after schema changes):**
```bash
cd backend
npx prisma generate
```

## Code Structure

### Backend Architecture

```
backend/src/
├── config/          # Configuration files
│   └── database.ts  # Prisma client instance
├── controllers/     # Business logic
│   ├── authController.ts
│   ├── courseController.ts
│   ├── assignmentController.ts
│   └── discussionController.ts
├── middleware/      # Express middleware
│   └── auth.ts      # Authentication & authorization
├── routes/          # API route definitions
│   ├── auth.ts
│   ├── courses.ts
│   ├── assignments.ts
│   └── discussions.ts
└── index.ts         # Express app initialization
```

### Frontend Architecture

```
frontend/src/
├── app/             # Next.js 14 app directory
│   ├── dashboard/   # Dashboard pages by role
│   ├── login/       # Login page
│   ├── register/    # Registration page
│   ├── layout.tsx   # Root layout
│   └── page.tsx     # Home page
├── lib/             # Utilities & services
│   ├── api.ts       # Axios instance
│   └── auth.ts      # Authentication service
└── types/           # TypeScript type definitions
    └── index.ts
```

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define interfaces for all data structures
- Avoid `any` type; use proper typing
- Use enums for fixed sets of values

### Naming Conventions

- **Files**: camelCase for JS/TS files (e.g., `authController.ts`)
- **Components**: PascalCase for React components (e.g., `LoginForm.tsx`)
- **Variables**: camelCase (e.g., `userName`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_URL`)
- **Interfaces/Types**: PascalCase (e.g., `User`, `Course`)

### Code Organization

**Controllers:**
- One controller per resource
- Keep functions focused and single-purpose
- Use async/await for asynchronous operations
- Always handle errors with try-catch

**API Routes:**
- Use RESTful conventions
- Apply middleware for authentication and validation
- Keep routes file clean; business logic goes in controllers

**Frontend Components:**
- Use functional components with hooks
- Keep components small and reusable
- Separate business logic from presentation
- Use TypeScript props interfaces

## Testing

### Backend Testing (Future Implementation)

```bash
cd backend
npm test
```

Recommended testing stack:
- Jest for unit tests
- Supertest for API testing
- Prisma test database

### Frontend Testing (Future Implementation)

```bash
cd frontend
npm test
```

Recommended testing stack:
- Jest for unit tests
- React Testing Library for component tests
- Cypress for E2E tests

## Common Development Tasks

### Adding a New Feature

1. **Backend:**
   ```bash
   # 1. Update Prisma schema if needed
   # Edit backend/prisma/schema.prisma
   
   # 2. Create migration
   npx prisma migrate dev --name add_feature_name
   
   # 3. Create controller
   # Create backend/src/controllers/featureController.ts
   
   # 4. Create routes
   # Create backend/src/routes/feature.ts
   
   # 5. Register routes in index.ts
   ```

2. **Frontend:**
   ```bash
   # 1. Add types
   # Edit frontend/src/types/index.ts
   
   # 2. Create page/component
   # Create files in frontend/src/app/
   
   # 3. Add API calls if needed
   # Update frontend/src/lib/
   ```

### Adding a New Database Model

1. Edit `backend/prisma/schema.prisma`
2. Run migration:
   ```bash
   npx prisma migrate dev --name add_model_name
   ```
3. Generate Prisma client:
   ```bash
   npx prisma generate
   ```
4. Update TypeScript types in frontend

### Adding Authentication to a Route

```typescript
// Backend route
import { authenticateToken, authorizeRole } from '../middleware/auth';

router.get('/protected', 
  authenticateToken, 
  authorizeRole('TEACHER', 'ADMIN'), 
  controller
);
```

### Making Authenticated API Calls

```typescript
// Frontend
import api from '@/lib/api';

const fetchData = async () => {
  try {
    const response = await api.get('/endpoint');
    return response.data;
  } catch (error) {
    console.error('Error:', error);
  }
};
```

## Debugging

### Backend Debugging

1. **Console Logging:**
   ```typescript
   console.log('Debug info:', variable);
   ```

2. **VS Code Debugger:**
   Create `.vscode/launch.json`:
   ```json
   {
     "version": "0.2.0",
     "configurations": [
       {
         "type": "node",
         "request": "launch",
         "name": "Debug Backend",
         "runtimeExecutable": "npm",
         "runtimeArgs": ["run", "dev"],
         "cwd": "${workspaceFolder}/backend",
         "console": "integratedTerminal"
       }
     ]
   }
   ```

3. **Database Queries:**
   ```typescript
   // Enable Prisma query logging
   const prisma = new PrismaClient({
     log: ['query', 'info', 'warn', 'error'],
   });
   ```

### Frontend Debugging

1. **Browser DevTools:**
   - Open Chrome DevTools (F12)
   - Use Console, Network, and React DevTools tabs

2. **React DevTools:**
   - Install React Developer Tools extension
   - Inspect component props and state

3. **Next.js Debugging:**
   - Check `.next` folder for build errors
   - Review console for client-side errors
   - Check terminal for server-side errors

## Performance Optimization

### Backend

- Use database indexes for frequently queried fields
- Implement pagination for large datasets
- Use Prisma's select to fetch only needed fields
- Cache frequent queries (Redis in production)
- Use connection pooling for database

### Frontend

- Use Next.js Image component for optimized images
- Implement code splitting for large components
- Use React.memo for expensive components
- Lazy load routes and components
- Minimize bundle size

## Git Workflow

1. **Create Feature Branch:**
   ```bash
   git checkout -b feature/feature-name
   ```

2. **Make Changes and Commit:**
   ```bash
   git add .
   git commit -m "feat: add feature description"
   ```

3. **Push and Create PR:**
   ```bash
   git push origin feature/feature-name
   ```

### Commit Message Convention

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

## Troubleshooting

### Common Issues

**Port Already in Use:**
```bash
# Find and kill process
lsof -i :5000
kill -9 <PID>
```

**Prisma Client Out of Sync:**
```bash
cd backend
npx prisma generate
```

**Frontend Not Connecting to Backend:**
- Check NEXT_PUBLIC_API_URL in .env
- Verify backend is running
- Check CORS configuration

**Database Connection Failed:**
- Verify PostgreSQL is running
- Check DATABASE_URL in .env
- Ensure database exists

## Useful Commands

```bash
# Backend
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npx prisma studio    # Open Prisma Studio
npx prisma generate  # Generate Prisma client
npx prisma migrate dev  # Run migrations

# Frontend
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint

# Docker
docker-compose up -d           # Start all services
docker-compose down            # Stop all services
docker-compose logs -f backend # View backend logs
docker-compose exec backend sh # Access backend container
```

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
