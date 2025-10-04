import { Response } from 'express';
import { body, validationResult } from 'express-validator';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const createDiscussionValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required'),
  body('courseId').notEmpty().withMessage('Course ID is required')
];

export const createDiscussion = async (req: AuthRequest, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, content, courseId } = req.body;
    const authorId = req.user!.id;

    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const discussion = await prisma.discussion.create({
      data: {
        title,
        content,
        courseId,
        authorId
      },
      include: {
        author: {
          select: { id: true, name: true, email: true }
        },
        course: {
          select: { id: true, title: true, code: true }
        }
      }
    });

    res.status(201).json(discussion);
  } catch (error) {
    console.error('Create discussion error:', error);
    res.status(500).json({ error: 'Failed to create discussion' });
  }
};

export const getDiscussions = async (req: AuthRequest, res: Response) => {
  try {
    const { courseId } = req.query;

    const where: any = {};
    if (courseId) {
      where.courseId = courseId;
    }

    const discussions = await prisma.discussion.findMany({
      where,
      include: {
        author: {
          select: { id: true, name: true, email: true }
        },
        course: {
          select: { id: true, title: true, code: true }
        },
        _count: {
          select: { comments: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(discussions);
  } catch (error) {
    console.error('Get discussions error:', error);
    res.status(500).json({ error: 'Failed to get discussions' });
  }
};

export const getDiscussion = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const discussion = await prisma.discussion.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, name: true, email: true }
        },
        course: {
          select: { id: true, title: true, code: true }
        },
        comments: {
          include: {
            author: {
              select: { id: true, name: true, email: true }
            }
          },
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    if (!discussion) {
      return res.status(404).json({ error: 'Discussion not found' });
    }

    res.json(discussion);
  } catch (error) {
    console.error('Get discussion error:', error);
    res.status(500).json({ error: 'Failed to get discussion' });
  }
};

export const addComment = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const authorId = req.user!.id;

    if (!content || content.trim() === '') {
      return res.status(400).json({ error: 'Content is required' });
    }

    const discussion = await prisma.discussion.findUnique({ where: { id } });
    if (!discussion) {
      return res.status(404).json({ error: 'Discussion not found' });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        discussionId: id,
        authorId
      },
      include: {
        author: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
};

export const deleteDiscussion = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const discussion = await prisma.discussion.findUnique({ where: { id } });
    if (!discussion) {
      return res.status(404).json({ error: 'Discussion not found' });
    }

    if (discussion.authorId !== userId && req.user!.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Not authorized to delete this discussion' });
    }

    await prisma.discussion.delete({ where: { id } });

    res.json({ message: 'Discussion deleted successfully' });
  } catch (error) {
    console.error('Delete discussion error:', error);
    res.status(500).json({ error: 'Failed to delete discussion' });
  }
};
