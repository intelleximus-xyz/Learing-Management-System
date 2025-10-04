import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Create sample users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@lms.com' },
    update: {},
    create: {
      email: 'admin@lms.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN'
    }
  });

  const teacher1 = await prisma.user.upsert({
    where: { email: 'teacher1@lms.com' },
    update: {},
    create: {
      email: 'teacher1@lms.com',
      password: hashedPassword,
      name: 'John Smith',
      role: 'TEACHER'
    }
  });

  const teacher2 = await prisma.user.upsert({
    where: { email: 'teacher2@lms.com' },
    update: {},
    create: {
      email: 'teacher2@lms.com',
      password: hashedPassword,
      name: 'Sarah Johnson',
      role: 'TEACHER'
    }
  });

  const student1 = await prisma.user.upsert({
    where: { email: 'student1@lms.com' },
    update: {},
    create: {
      email: 'student1@lms.com',
      password: hashedPassword,
      name: 'Alice Brown',
      role: 'STUDENT'
    }
  });

  const student2 = await prisma.user.upsert({
    where: { email: 'student2@lms.com' },
    update: {},
    create: {
      email: 'student2@lms.com',
      password: hashedPassword,
      name: 'Bob Wilson',
      role: 'STUDENT'
    }
  });

  const student3 = await prisma.user.upsert({
    where: { email: 'student3@lms.com' },
    update: {},
    create: {
      email: 'student3@lms.com',
      password: hashedPassword,
      name: 'Charlie Davis',
      role: 'STUDENT'
    }
  });

  console.log('Created users');

  // Create sample courses
  const course1 = await prisma.course.upsert({
    where: { code: 'CS101' },
    update: {},
    create: {
      title: 'Introduction to Computer Science',
      description: 'Learn the fundamentals of programming and computer science concepts.',
      code: 'CS101',
      teacherId: teacher1.id
    }
  });

  const course2 = await prisma.course.upsert({
    where: { code: 'MATH201' },
    update: {},
    create: {
      title: 'Calculus I',
      description: 'Introduction to differential and integral calculus.',
      code: 'MATH201',
      teacherId: teacher2.id
    }
  });

  const course3 = await prisma.course.upsert({
    where: { code: 'ENG101' },
    update: {},
    create: {
      title: 'English Composition',
      description: 'Develop writing and critical thinking skills.',
      code: 'ENG101',
      teacherId: teacher1.id
    }
  });

  console.log('Created courses');

  // Create enrollments
  await prisma.enrollment.upsert({
    where: {
      userId_courseId: {
        userId: student1.id,
        courseId: course1.id
      }
    },
    update: {},
    create: {
      userId: student1.id,
      courseId: course1.id
    }
  });

  await prisma.enrollment.upsert({
    where: {
      userId_courseId: {
        userId: student1.id,
        courseId: course2.id
      }
    },
    update: {},
    create: {
      userId: student1.id,
      courseId: course2.id
    }
  });

  await prisma.enrollment.upsert({
    where: {
      userId_courseId: {
        userId: student2.id,
        courseId: course1.id
      }
    },
    update: {},
    create: {
      userId: student2.id,
      courseId: course1.id
    }
  });

  await prisma.enrollment.upsert({
    where: {
      userId_courseId: {
        userId: student2.id,
        courseId: course3.id
      }
    },
    update: {},
    create: {
      userId: student2.id,
      courseId: course3.id
    }
  });

  await prisma.enrollment.upsert({
    where: {
      userId_courseId: {
        userId: student3.id,
        courseId: course2.id
      }
    },
    update: {},
    create: {
      userId: student3.id,
      courseId: course2.id
    }
  });

  console.log('Created enrollments');

  // Create assignments
  const assignment1 = await prisma.assignment.create({
    data: {
      title: 'Assignment 1: Hello World',
      description: 'Write your first program that prints "Hello, World!" to the console.',
      courseId: course1.id,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      maxGrade: 100
    }
  });

  const assignment2 = await prisma.assignment.create({
    data: {
      title: 'Assignment 2: Variables and Data Types',
      description: 'Complete exercises on variables, data types, and basic operations.',
      courseId: course1.id,
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      maxGrade: 100
    }
  });

  const assignment3 = await prisma.assignment.create({
    data: {
      title: 'Calculus Problem Set 1',
      description: 'Solve problems on limits and continuity.',
      courseId: course2.id,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      maxGrade: 100
    }
  });

  console.log('Created assignments');

  // Create sample submissions
  await prisma.submission.create({
    data: {
      assignmentId: assignment1.id,
      studentId: student1.id,
      content: 'print("Hello, World!")',
      status: 'GRADED',
      grade: 95,
      feedback: 'Excellent work! Your code is clean and follows best practices.'
    }
  });

  await prisma.submission.create({
    data: {
      assignmentId: assignment1.id,
      studentId: student2.id,
      content: 'console.log("Hello, World!")',
      status: 'SUBMITTED'
    }
  });

  console.log('Created submissions');

  // Create discussions
  const discussion1 = await prisma.discussion.create({
    data: {
      title: 'Getting Started with Programming',
      content: 'What are your thoughts on the first week of class? Any questions?',
      courseId: course1.id,
      authorId: teacher1.id
    }
  });

  const discussion2 = await prisma.discussion.create({
    data: {
      title: 'Calculus Study Group',
      content: 'Anyone interested in forming a study group for the upcoming exam?',
      courseId: course2.id,
      authorId: student1.id
    }
  });

  console.log('Created discussions');

  // Create comments
  await prisma.comment.create({
    data: {
      content: 'I found the first week challenging but exciting!',
      discussionId: discussion1.id,
      authorId: student1.id
    }
  });

  await prisma.comment.create({
    data: {
      content: 'Great question! I recommend reviewing the textbook chapter 1.',
      discussionId: discussion1.id,
      authorId: teacher1.id
    }
  });

  await prisma.comment.create({
    data: {
      content: 'I would love to join! When and where should we meet?',
      discussionId: discussion2.id,
      authorId: student3.id
    }
  });

  console.log('Created comments');

  console.log('Database seed completed successfully!');
  console.log('\nSample users created:');
  console.log('- Admin: admin@lms.com / password123');
  console.log('- Teacher 1: teacher1@lms.com / password123');
  console.log('- Teacher 2: teacher2@lms.com / password123');
  console.log('- Student 1: student1@lms.com / password123');
  console.log('- Student 2: student2@lms.com / password123');
  console.log('- Student 3: student3@lms.com / password123');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
