// import Router from 'express';
// import { auth, requireAdminPermission, upload, validate } from '@/middlewares';
// import { PERMISSIONS } from '@admin/permission';
// import { validateId } from '@/schema';
// import { FileController } from './file.controller';
// import { fileUploadSchema, queryFileSchema, updateFileSchema } from './schemas';
// import { Role } from '@/shared/constants';

// export const FileRouter = Router();
// const controller = new FileController();

// FileRouter.route('/')
//   .get(validate(queryFileSchema, 'query'), controller.getFiles)
//   .post(upload.single('file'), controller.upload);

// FileRouter.route('/:id')
//   .get(validate(validateId, 'params'), controller.getFile)
//   .patch(
//     auth(Role.ADMIN),
//     requireAdminPermission(PERMISSIONS.FILE.UPDATE),
//     validate(validateId),
//     validate(updateFileSchema),
//     controller.updateFile
//   )
//   .delete(
//     adminAuth,
//     requireAdminPermission(PERMISSIONS.FILE.DELETE),
//     validate(validateId, 'params'),
//     controller.deleteFile
//   );
