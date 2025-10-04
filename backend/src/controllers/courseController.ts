import { Response } from 'express';
import { body, validationResult } from 'express-validator';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const createCourseValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('code').notEmpty().withMessage('Course code is required')
];

export const createCourse = async (req: AuthRequest, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, description, code } = req.body;
    const teacherId = req.user!.id;

    const existingCourse = await prisma.course.findUnique({ where: { code } });
    if (existingCourse) {
      return res.status(400).json({ error: 'Course code already exists' });
    }

    const course = await prisma.course.create({
      data: {
        title,
        description,
        code,
        teacherId
      },
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.status(201).json(course);
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ error: 'Failed to create course' });
  }
};

export const getCourses = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const userRole = req.user!.role;

    let courses;

    if (userRole === 'TEACHER') {
      courses = await prisma.course.findMany({
        where: { teacherId: userId },
        include: {
          teacher: {
            select: { id: true, name: true, email: true }
          },
          _count: {
            select: { enrollments: true, assignments: true }
          }
        }
      });
    } else if (userRole === 'STUDENT') {
      courses = await prisma.course.findMany({
        where: {
          enrollments: {
            some: { userId }
          }
        },
        include: {
          teacher: {
            select: { id: true, name: true, email: true }
          },
          _count: {
            select: { enrollments: true, assignments: true }
          }
        }
      });
    } else {
      courses = await prisma.course.findMany({
        include: {
          teacher: {
            select: { id: true, name: true, email: true }
          },
          _count: {
            select: { enrollments: true, assignments: true }
          }
        }
      });
    }

    res.json(courses);
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ error: 'Failed to get courses' });
  }
};

export const getCourse = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        teacher: {
          select: { id: true, name: true, email: true }
        },
        enrollments: {
          include: {
            user: {
              select: { id: true, name: true, email: true }
            }
          }
        },
        assignments: {
          orderBy: { dueDate: 'asc' }
        },
        _count: {
          select: { enrollments: true, assignments: true, discussions: true }
        }
      }
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ error: 'Failed to get course' });
  }
};

export const enrollCourse = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const course = await prisma.course.findUnique({ where: { id } });
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: { userId, courseId: id }
      }
    });

    if (existingEnrollment) {
      return res.status(400).json({ error: 'Already enrolled in this course' });
    }

    const enrollment = await prisma.enrollment.create({
      data: {
        userId,
        courseId: id
      },
      include: {
        course: {
          include: {
            teacher: {
              select: { id: true, name: true, email: true }
            }
          }
        }
      }
    });

    res.status(201).json(enrollment);
  } catch (error) {
    console.error('Enroll course error:', error);
    res.status(500).json({ error: 'Failed to enroll in course' });
  }
};

export const updateCourse = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const userId = req.user!.id;

    const course = await prisma.course.findUnique({ where: { id } });
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    if (course.teacherId !== userId && req.user!.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Not authorized to update this course' });
    }

    const updatedCourse = await prisma.course.update({
      where: { id },
      data: { title, description },
      include: {
        teacher: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    res.json(updatedCourse);
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({ error: 'Failed to update course' });
  }
};

export const deleteCourse = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const course = await prisma.course.findUnique({ where: { id } });
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    if (course.teacherId !== userId && req.user!.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Not authorized to delete this course' });
    }

    await prisma.course.delete({ where: { id } });

    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ error: 'Failed to delete course' });
  }
};
