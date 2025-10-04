import { Router } from 'express';
import {
  createAssignment,
  getAssignments,
  getAssignment,
  submitAssignment,
  gradeSubmission,
  getSubmissions,
  createAssignmentValidation
} from '../controllers/assignmentController';
import { authenticateToken, authorizeRole } from '../middleware/auth';

const router = Router();

router.post('/', authenticateToken, authorizeRole('TEACHER', 'ADMIN'), createAssignmentValidation, createAssignment);
router.get('/', authenticateToken, getAssignments);
router.get('/:id', authenticateToken, getAssignment);
router.post('/:id/submit', authenticateToken, authorizeRole('STUDENT'), submitAssignment);
router.post('/submissions/:id/grade', authenticateToken, authorizeRole('TEACHER', 'ADMIN'), gradeSubmission);
router.get('/submissions/list', authenticateToken, getSubmissions);

export default router;
