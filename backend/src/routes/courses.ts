import { Router } from 'express';
import {
  createCourse,
  getCourses,
  getCourse,
  enrollCourse,
  updateCourse,
  deleteCourse,
  createCourseValidation
} from '../controllers/courseController';
import { authenticateToken, authorizeRole } from '../middleware/auth';

const router = Router();

router.post('/', authenticateToken, authorizeRole('TEACHER', 'ADMIN'), createCourseValidation, createCourse);
router.get('/', authenticateToken, getCourses);
router.get('/:id', authenticateToken, getCourse);
router.post('/:id/enroll', authenticateToken, authorizeRole('STUDENT'), enrollCourse);
router.put('/:id', authenticateToken, authorizeRole('TEACHER', 'ADMIN'), updateCourse);
router.delete('/:id', authenticateToken, authorizeRole('TEACHER', 'ADMIN'), deleteCourse);

export default router;
