import { Router } from 'express';

// import { adminRouter } from '@admin/admins/admin.route';
// import { FileRouter } from '@file/file.route';
// import { NotificationRouter } from '@notification/notification.route';
// import { AdminAuthRouter } from '@/modules/admin/auth';
import { templateRoutes } from '@/modules/module-template';
import { permissionRoutes } from '@/modules/admin/permission';
import { adminRoleRoutes } from '@/modules/admin/role';
import { adminUsersRoutes } from '@/modules/admin/admins';
import { authRoutes } from '@/modules/admin/auth';

const adminRoutes = Router();

adminRoutes.use('/templates', templateRoutes);
adminRoutes.use('/auth', authRoutes);
adminRoutes.use('/admin-permissions', permissionRoutes);
adminRoutes.use('/admin-roles', adminRoleRoutes);
adminRoutes.use('/admins', adminUsersRoutes);

// adminRoutes.use('/auth', AdminAuthRouter);
// adminRoutes.use('/admins', adminRouter);
// adminRoutes.use('/upload', FileRouter);
// adminRoutes.use('/notification', NotificationRouter);
export default adminRoutes;

// v1/admin/roles
// v1/admin/user/roles
// v1/admin/user/id
