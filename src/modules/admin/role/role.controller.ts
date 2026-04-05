import { Request, Response } from 'express';

import { RoleService } from './role.service.js';
import { asyncHandler, sendResponse } from '@/shared/utils';
import { HttpStatus } from '@/shared/constants';
import { RoleLean } from './role.model.js';
import { ApiResponse } from '@/shared/types';
import { rolePaginationSchema } from './schemas';

export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  getRoles = asyncHandler(async (req: Request, res: Response<ApiResponse<Array<RoleLean>>>) => {
    const query = rolePaginationSchema.parse(req.query);

    const result = await this.roleService.getRoles(query);

    sendResponse(res, {
      statusCode: HttpStatus.OK,
      data: result.data,
      pagination: result.pagination,
    });
  });

  getRole = asyncHandler(async (req: Request, res: Response<ApiResponse<RoleLean>>) => {
    const role = await this.roleService.getRole(req.params.id);

    sendResponse(res, {
      statusCode: HttpStatus.OK,
      data: role,
    });
  });

  createRole = asyncHandler(async (req: Request, res: Response<ApiResponse<RoleLean>>) => {
    const role = await this.roleService.createRole(req.body);

    sendResponse(res, {
      statusCode: HttpStatus.CREATED,
      data: role,
      message: 'role created successfully',
    });
  });

  updateRole = asyncHandler(async (req: Request, res: Response) => {
    const updatedrole = await this.roleService.updateRole(req.body, req.params.id);

    sendResponse(res, {
      statusCode: HttpStatus.OK,
      data: updatedrole,
    });
  });

  deleteRole = asyncHandler(async (req: Request, res: Response<ApiResponse<null>>) => {
    const id = req.params.id;
    await this.roleService.deleteRole(id);

    sendResponse(res, {
      statusCode: HttpStatus.OK,
      message: 'role deleted successfully',
      data: null,
    });
  });
}
