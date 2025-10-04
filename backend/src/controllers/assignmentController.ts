import { Response } from 'express';
import { body, validationResult } from 'express-validator';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const createAssignmentValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('courseId').notEmpty().withMessage('Course ID is required'),
  body('dueDate').isISO8601().withMessage('Valid due date is required'),
  body('maxGrade').optional().isInt({ min: 1 }).withMessage('Max grade must be a positive integer')
];

export const createAssignment = async (req: AuthRequest, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, description, courseId, dueDate, maxGrade } = req.body;
    const userId = req.user!.id;

    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    if (course.teacherId !== userId && req.user!.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Not authorized to create assignment for this course' });
    }

    const assignment = await prisma.assignment.create({
      data: {
        title,
        description,
        courseId,
        dueDate: new Date(dueDate),
        maxGrade: maxGrade || 100
      },
      include: {
        course: {
          select: { id: true, title: true, code: true }
        }
      }
    });

    res.status(201).json(assignment);
  } catch (error) {
    console.error('Create assignment error:', error);
    res.status(500).json({ error: 'Failed to create assignment' });
  }
};

export const getAssignments = async (req: AuthRequest, res: Response) => {
  try {
    const { courseId } = req.query;
    const userId = req.user!.id;

    const where: any = {};
    if (courseId) {
      where.courseId = courseId;
    }

    const assignments = await prisma.assignment.findMany({
      where,
      include: {
        course: {
          select: { id: true, title: true, code: true, teacherId: true }
        },
        _count: {
          select: { submissions: true }
        }
      },
      orderBy: { dueDate: 'asc' }
    });

    res.json(assignments);
  } catch (error) {
    console.error('Get assignments error:', error);
    res.status(500).json({ error: 'Failed to get assignments' });
  }
};

export const getAssignment = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const assignment = await prisma.assignment.findUnique({
      where: { id },
      include: {
        course: {
          select: { id: true, title: true, code: true, teacherId: true }
        },
        submissions: {
          include: {
            student: {
              select: { id: true, name: true, email: true }
            }
          }
        }
      }
    });

    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    res.json(assignment);
  } catch (error) {
    console.error('Get assignment error:', error);
    res.status(500).json({ error: 'Failed to get assignment' });
  }
};

export const submitAssignment = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { content, fileUrl } = req.body;
    const studentId = req.user!.id;

    const assignment = await prisma.assignment.findUnique({ where: { id } });
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    const existingSubmission = await prisma.submission.findUnique({
      where: {
        assignmentId_studentId: { assignmentId: id, studentId }
      }
    });

    if (existingSubmission) {
      return res.status(400).json({ error: 'Assignment already submitted' });
    }

    const submission = await prisma.submission.create({
      data: {
        assignmentId: id,
        studentId,
        content,
        fileUrl,
        status: 'SUBMITTED'
      },
      include: {
        assignment: {
          select: { id: true, title: true, maxGrade: true }
        },
        student: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    res.status(201).json(submission);
  } catch (error) {
    console.error('Submit assignment error:', error);
    res.status(500).json({ error: 'Failed to submit assignment' });
  }
};

export const gradeSubmission = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { grade, feedback } = req.body;
    const userId = req.user!.id;

    const submission = await prisma.submission.findUnique({
      where: { id },
      include: {
        assignment: {
          include: {
            course: true
          }
        }
      }
    });

    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    if (submission.assignment.course.teacherId !== userId && req.user!.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Not authorized to grade this submission' });
    }

    if (grade > submission.assignment.maxGrade) {
      return res.status(400).json({ error: `Grade cannot exceed ${submission.assignment.maxGrade}` });
    }

    const updatedSubmission = await prisma.submission.update({
      where: { id },
      data: {
        grade,
        feedback,
        status: 'GRADED',
        gradedAt: new Date()
      },
      include: {
        assignment: {
          select: { id: true, title: true, maxGrade: true }
        },
        student: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    res.json(updatedSubmission);
  } catch (error) {
    console.error('Grade submission error:', error);
    res.status(500).json({ error: 'Failed to grade submission' });
  }
};

export const getSubmissions = async (req: AuthRequest, res: Response) => {
  try {
    const { assignmentId } = req.query;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const where: any = {};
    
    if (assignmentId) {
      where.assignmentId = assignmentId;
    }

    if (userRole === 'STUDENT') {
      where.studentId = userId;
    }

    const submissions = await prisma.submission.findMany({
      where,
      include: {
        assignment: {
          select: { id: true, title: true, maxGrade: true, dueDate: true }
        },
        student: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { submittedAt: 'desc' }
    });

    res.json(submissions);
  } catch (error) {
    console.error('Get submissions error:', error);
    res.status(500).json({ error: 'Failed to get submissions' });
  }
};
