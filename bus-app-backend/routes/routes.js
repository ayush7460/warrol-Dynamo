import express from 'express';
import { routeController } from '../controllers/routeController.js';
import { auth, checkRole, checkApproved } from '../middleware/auth.js';

const router = express.Router();

router.post('/', auth, checkRole(['busowner']), checkApproved, routeController.addRoute);
router.get('/my', auth, checkRole(['busowner']), checkApproved, routeController.listMyRoutes);
router.get('/:id', routeController.getRouteDetails);
router.get('/', routeController.listAllRoutes);

export default router;