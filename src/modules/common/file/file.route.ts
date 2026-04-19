import { auth, upload, validate } from '@/middlewares';
import { Router } from 'express';
import { fileController } from './file.module';
import { Role, ValidationSource } from '@/shared/constants';
import { fileUploadSchema } from './schemas';

export const fileRoutes = Router();

fileRoutes
  .route('/upload')
  .post(
    auth(Role.USER),
    validate(fileUploadSchema, ValidationSource.FILE),
    upload.single('file'),
    fileController.uploadFile
  );
