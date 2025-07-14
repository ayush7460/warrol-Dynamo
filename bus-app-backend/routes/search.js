import express from 'express';
import { busSearchController } from '../controllers/busSearchController.js';

const router = express.Router();

router.get('/buses', busSearchController.searchBuses);
router.get('/buses/:scheduleId', busSearchController.getBusDetails);

export default router;