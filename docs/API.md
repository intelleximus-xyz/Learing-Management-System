# API Documentation

## Base URL
- Development: `http://localhost:5000/api`
- Production: `https://your-backend-app.azurewebsites.net/api`

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Endpoints

### Authentication

#### Register User
- **POST** `/auth/register`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe",
    "role": "STUDENT" // Optional: STUDENT, TEACHER, ADMIN
  }
  ```
- **Response:**
  ```json
  {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "STUDENT",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "jwt-token"
  }
  ```

#### Login
- **POST** `/auth/login`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "STUDENT"
    },
    "token": "jwt-token"
  }
  ```

#### Get Profile
- **GET** `/auth/profile`
- **Auth Required:** Yes
- **Response:**
  ```json
  {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "STUDENT",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
  ```

### Courses

#### Create Course
- **POST** `/courses`
- **Auth Required:** Yes (TEACHER, ADMIN)
- **Body:**
  ```json
  {
    "title": "Introduction to Computer Science",
    "description": "Learn the fundamentals of programming",
    "code": "CS101"
  }
  ```
- **Response:**
  ```json
  {
    "id": "uuid",
    "title": "Introduction to Computer Science",
    "description": "Learn the fundamentals of programming",
    "code": "CS101",
    "teacherId": "uuid",
    "teacher": {
      "id": "uuid",
      "name": "Teacher Name",
      "email": "teacher@example.com"
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
  ```

#### Get All Courses
- **GET** `/courses`
- **Auth Required:** Yes
- **Response:**
  ```json
  [
    {
      "id": "uuid",
      "title": "Introduction to Computer Science",
      "code": "CS101",
      "teacher": {
        "id": "uuid",
        "name": "Teacher Name"
      },
      "_count": {
        "enrollments": 25,
        "assignments": 5
      }
    }
  ]
  ```

#### Get Single Course
- **GET** `/courses/:id`
- **Auth Required:** Yes
- **Response:**
  ```json
  {
    "id": "uuid",
    "title": "Introduction to Computer Science",
    "description": "Learn the fundamentals",
    "code": "CS101",
    "teacher": {
      "id": "uuid",
      "name": "Teacher Name",
      "email": "teacher@example.com"
    },
    "enrollments": [...],
    "assignments": [...]
  }
  ```

#### Enroll in Course
- **POST** `/courses/:id/enroll`
- **Auth Required:** Yes (STUDENT)
- **Response:**
  ```json
  {
    "id": "uuid",
    "userId": "uuid",
    "courseId": "uuid",
    "enrolledAt": "2024-01-01T00:00:00.000Z",
    "course": {...}
  }
  ```

#### Update Course
- **PUT** `/courses/:id`
- **Auth Required:** Yes (TEACHER of course, ADMIN)
- **Body:**
  ```json
  {
    "title": "Updated Title",
    "description": "Updated Description"
  }
  ```

#### Delete Course
- **DELETE** `/courses/:id`
- **Auth Required:** Yes (TEACHER of course, ADMIN)

### Assignments

#### Create Assignment
- **POST** `/assignments`
- **Auth Required:** Yes (TEACHER, ADMIN)
- **Body:**
  ```json
  {
    "title": "Assignment 1",
    "description": "Complete the exercises",
    "courseId": "uuid",
    "dueDate": "2024-12-31T23:59:59.000Z",
    "maxGrade": 100
  }
  ```

#### Get Assignments
- **GET** `/assignments?courseId=uuid`
- **Auth Required:** Yes
- **Query Params:**
  - `courseId`: Filter by course (optional)

#### Get Single Assignment
- **GET** `/assignments/:id`
- **Auth Required:** Yes

#### Submit Assignment
- **POST** `/assignments/:id/submit`
- **Auth Required:** Yes (STUDENT)
- **Body:**
  ```json
  {
    "content": "My submission content",
    "fileUrl": "https://example.com/file.pdf" // Optional
  }
  ```

#### Grade Submission
- **POST** `/assignments/submissions/:id/grade`
- **Auth Required:** Yes (TEACHER, ADMIN)
- **Body:**
  ```json
  {
    "grade": 95,
    "feedback": "Excellent work!"
  }
  ```

#### Get Submissions
- **GET** `/assignments/submissions/list?assignmentId=uuid`
- **Auth Required:** Yes
- **Query Params:**
  - `assignmentId`: Filter by assignment (optional)

### Discussions

#### Create Discussion
- **POST** `/discussions`
- **Auth Required:** Yes
- **Body:**
  ```json
  {
    "title": "Discussion Topic",
    "content": "Discussion content",
    "courseId": "uuid"
  }
  ```

#### Get Discussions
- **GET** `/discussions?courseId=uuid`
- **Auth Required:** Yes
- **Query Params:**
  - `courseId`: Filter by course (optional)

#### Get Single Discussion
- **GET** `/discussions/:id`
- **Auth Required:** Yes

#### Add Comment
- **POST** `/discussions/:id/comments`
- **Auth Required:** Yes
- **Body:**
  ```json
  {
    "content": "My comment"
  }
  ```

#### Delete Discussion
- **DELETE** `/discussions/:id`
- **Auth Required:** Yes (Author, ADMIN)

## Error Responses

### 400 Bad Request
```json
{
  "error": "Error message",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email address"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "error": "Access token required"
}
```

### 403 Forbidden
```json
{
  "error": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```
