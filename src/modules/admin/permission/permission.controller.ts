import { Request, Response } from 'express';

import { PermissionService } from './permission.service.js';
import { asyncHandler, sendResponse } from '@/shared/utils';
import { HttpStatus } from '@/shared/constants';
import { PermissionLean } from './permission.model.js';
import { ApiResponse } from '@/shared/types';
import { permissionPaginationSchema } from './schemas';

export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  getPermissions = asyncHandler(
    async (req: Request, res: Response<ApiResponse<Array<PermissionLean>>>) => {
      const query = permissionPaginationSchema.parse(req.query);

      const result = await this.permissionService.getPermissions(query);

      sendResponse(res, {
        statusCode: HttpStatus.OK,
        data: result.data,
        pagination: result.pagination,
      });
    }
  );

  getPermission = asyncHandler(async (req: Request, res: Response<ApiResponse<PermissionLean>>) => {
    const permission = await this.permissionService.getPermissionById(req.params.id);

    sendResponse(res, {
      statusCode: HttpStatus.OK,
      data: permission,
    });
  });

  createPermissioin = asyncHandler(
    async (req: Request, res: Response<ApiResponse<PermissionLean>>) => {
      const permission = await this.permissionService.createPermissioin(req.body);

      sendResponse(res, {
        statusCode: HttpStatus.CREATED,
        data: permission,
        message: 'Permission created successfully',
      });
    }
  );

  updatePermission = asyncHandler(async (req: Request, res: Response) => {
    const updatedPermission = await this.permissionService.updatePermissionById(
      req.params.id,
      req.body
    );
    sendResponse(res, {
      statusCode: 200,
      data: updatedPermission,
    });
  });

  deletePermission = asyncHandler(async (req: Request, res: Response<ApiResponse<null>>) => {
    const id = req.params.id;
    await this.permissionService.deletePermission(id);
    sendResponse(res, {
      statusCode: HttpStatus.OK,
      message: 'Permission deleted successfully',
      data: null,
    });
  });
}
