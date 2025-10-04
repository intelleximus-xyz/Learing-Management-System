import { Router } from 'express';
import {
  createDiscussion,
  getDiscussions,
  getDiscussion,
  addComment,
  deleteDiscussion,
  createDiscussionValidation
} from '../controllers/discussionController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/', authenticateToken, createDiscussionValidation, createDiscussion);
router.get('/', authenticateToken, getDiscussions);
router.get('/:id', authenticateToken, getDiscussion);
router.post('/:id/comments', authenticateToken, addComment);
router.delete('/:id', authenticateToken, deleteDiscussion);

export default router;
