import express from 'express';
import { scheduleController } from '../controllers/scheduleController.js';
import { auth, checkRole, checkApproved } from '../middleware/auth.js';

const router = express.Router();

router.post('/', auth, checkRole(['busowner']), checkApproved, scheduleController.createSchedule);
router.get('/my', auth, checkRole(['busowner']), checkApproved, scheduleController.listMySchedules);
router.get('/:id', scheduleController.getScheduleDetails);
router.get('/', scheduleController.listAllSchedules);

export default router;