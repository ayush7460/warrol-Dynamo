import express from 'express';
import { adminController } from '../controllers/adminController.js';
import { auth, checkRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/pending-owners', auth, checkRole(['admin']), adminController.listPendingOwners);
router.post('/approve-owner/:id', auth, checkRole(['admin']), adminController.approveOwner);

export default router;