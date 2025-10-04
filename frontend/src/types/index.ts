export interface User {
  id: string;
  email: string;
  name: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
  createdAt: string;
  updatedAt?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  code: string;
  teacherId: string;
  teacher?: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  courseId: string;
  course?: {
    id: string;
    title: string;
    code: string;
  };
  dueDate: string;
  maxGrade: number;
  createdAt: string;
  updatedAt: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  content: string;
  fileUrl?: string;
  status: 'PENDING' | 'SUBMITTED' | 'GRADED';
  grade?: number;
  feedback?: string;
  submittedAt: string;
  gradedAt?: string;
}

export interface Discussion {
  id: string;
  title: string;
  content: string;
  courseId: string;
  authorId: string;
  author?: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  content: string;
  discussionId: string;
  authorId: string;
  author?: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
