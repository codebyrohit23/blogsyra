import { Request, Response } from 'express';
import { AdminService } from './admin.service';
import { HttpStatus } from '@/shared/constants';
import { AdminDocument, AdminLean } from './admin.model';
import { asyncHandler, sendResponse } from '@/shared/utils';
import { ApiResponse } from '@/shared/types';
import { adminPaginationSchema } from './schemas';

export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // login = asyncHandler(async (req: Request, res: Response<ApiResponse<AuthResponse>>) => {
  //   const { admin, tokensResponse } = await this.adminService.login(req.body);

  //   const cookieMaxAge = config.token.refresh.expiresIn;

  //   res.cookie(REFRESH_TOKEN, tokensResponse.refresh.token, {
  //     httpOnly: true,
  //     secure: config.app.nodeEnv === Environment.PRODUCTION,
  //     sameSite: 'strict',
  //     maxAge: cookieMaxAge * 1000,
  //   });

  //   sendResponse(res, {
  //     statusCode: HttpStatus.OK,
  //     data: {
  //       admin: admin,
  //       token: { access: tokensResponse.access },
  //     },
  //   });
  // });

  // register = asyncHandler(async (req: Request, res: Response<ApiResponse<AuthResponse>>) => {
  //   const { admin, tokensResponse } = await this.adminService.register(req.body);

  //   const cookieMaxAge = config.token.refresh.expiresIn;

  //   res.cookie(REFRESH_TOKEN, tokensResponse.refresh.token, {
  //     httpOnly: true,
  //     secure: config.app.nodeEnv === Environment.PRODUCTION,
  //     sameSite: 'strict',
  //     maxAge: cookieMaxAge * 1000,
  //   });

  //   sendResponse(res, {
  //     statusCode: HttpStatus.OK,
  //     data: {
  //       admin: admin,
  //       token: { access: tokensResponse.access },
  //     },
  //   });
  // });

  getAdmins = asyncHandler(async (req: Request, res: Response<ApiResponse<Array<AdminLean>>>) => {
    const query = adminPaginationSchema.parse(req.query);

    const result = await this.adminService.getAdmins(query);

    sendResponse(res, {
      statusCode: HttpStatus.OK,
      data: result.data,
      pagination: result.pagination,
    });
  });

  createAdmin = asyncHandler(async (req: Request, res: Response<ApiResponse<AdminDocument>>) => {
    const admin = await this.adminService.createAdminByAdmin(req.body, req.user.sub);

    sendResponse(res, {
      statusCode: HttpStatus.CREATED,
      message: 'Admin created successfully',
      data: admin,
    });
  });

  getAdmin = asyncHandler(async (req: Request, res: Response<ApiResponse<AdminLean>>) => {
    const admin = await this.adminService.getAdminById(req.params.id);

    sendResponse(res, {
      statusCode: HttpStatus.OK,
      data: admin,
    });
  });

  updateAdmin = asyncHandler(async (req: Request, res: Response<ApiResponse<AdminLean>>) => {
    const admin = await this.adminService.updateAdminById(req.params.id, req.body);

    sendResponse(res, {
      statusCode: HttpStatus.OK,
      message: 'Admin updated successfully',
      data: admin,
    });
  });

  deleteAdmin = asyncHandler(async (req: Request, res: Response<ApiResponse<null>>) => {
    await this.adminService.deleteAdmin(req.params.id);

    sendResponse(res, {
      statusCode: HttpStatus.OK,
      message: 'Admin deleted successfully',
      data: null,
    });
  });
}
