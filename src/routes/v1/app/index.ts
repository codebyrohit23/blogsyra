import { authRoutes } from '@/modules/auth';
import { Router } from 'express';

// import userRoutes from '@/modules/app/user/user.routes.js';

const appRoutes = Router();

appRoutes.use('/auth', authRoutes);

export default appRoutes;
