import { Router } from 'express';
import {
  deleteUpload,
  getDownloadUrl,
  getUploadUrl,
} from '../controllers/upload.controller';

const router = Router();

router.post('/uploads/presign', getUploadUrl);
router.get('/uploads/presign', getDownloadUrl);
router.delete('/uploads', deleteUpload);

export default router;
