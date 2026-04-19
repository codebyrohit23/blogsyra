import { authRoutes } from '@/modules/auth';
import { fileRoutes } from '@/modules/common/file';
import { Router } from 'express';

// import userRoutes from '@/modules/app/user/user.routes.js';

const appRoutes = Router();

appRoutes.use('/auth', authRoutes);
appRoutes.use('/file', fileRoutes);

export default appRoutes;
