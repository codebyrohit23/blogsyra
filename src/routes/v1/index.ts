import { Router } from 'express';
import appRoutes from './app/index.js';
import adminRoutes from './admin/index.js';

const v1Router = Router();

v1Router.use('/', appRoutes);
v1Router.use('/admin', adminRoutes);

export default v1Router;
