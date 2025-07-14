import express from 'express';
import { busController } from '../controllers/busController.js';
import { auth, checkRole, checkApproved } from '../middleware/auth.js';

const router = express.Router();

router.post('/', auth, checkRole(['busowner']), checkApproved, busController.addBus);
router.get('/my', auth, checkRole(['busowner']), checkApproved, busController.listMyBuses);
router.put('/:id', auth, checkRole(['busowner']), checkApproved, busController.updateBus);
router.get('/:id', auth, busController.getBusDetails);
router.get('/', busController.listAllBuses);

export default router;