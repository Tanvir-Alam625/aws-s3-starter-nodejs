import { Router } from 'express';
import healthRoutes from './health.routes';
import uploadRoutes from './upload.routes';

const router = Router();

router.use(healthRoutes);
router.use(uploadRoutes);

export default router;
