import { Request, Response } from 'express';
import { TemplateService } from './template.service';
import { HttpStatus } from '@/shared/constants';
import { TemplateDocument, TemplateLean } from './template.model';
import { asyncHandler, sendResponse } from '@/shared/utils';
import { ApiResponse } from '@/shared/types';
import { templatePaginationSchema } from './schemas';

export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  getTemplates = asyncHandler(
    async (req: Request, res: Response<ApiResponse<Array<TemplateLean>>>) => {
      const query = templatePaginationSchema.parse(req.query);

      const result = await this.templateService.getTemplates(query);

      sendResponse(res, {
        statusCode: HttpStatus.OK,
        data: result.data,
        pagination: result.pagination,
      });
    }
  );

  createTemplate = asyncHandler(
    async (req: Request, res: Response<ApiResponse<TemplateDocument>>) => {
      const template = await this.templateService.createTemplate(req.body, req.user.sub);

      sendResponse(res, {
        statusCode: HttpStatus.CREATED,
        message: 'Template created successfully',
        data: template,
      });
    }
  );

  getTemplate = asyncHandler(async (req: Request, res: Response<ApiResponse<TemplateLean>>) => {
    const template = await this.templateService.getTemplate(req.params.id);

    sendResponse(res, {
      statusCode: HttpStatus.OK,
      data: template,
    });
  });

  updateTemplate = asyncHandler(async (req: Request, res: Response<ApiResponse<TemplateLean>>) => {
    const template = await this.templateService.updateTemplate(req.body, req.params.id);

    sendResponse(res, {
      statusCode: HttpStatus.OK,
      message: 'Template updated successfully',
      data: template,
    });
  });

  deleteTemplate = asyncHandler(async (req: Request, res: Response<ApiResponse<null>>) => {
    await this.templateService.deleteTemplate(req.params.id);

    sendResponse(res, {
      statusCode: HttpStatus.OK,
      message: 'Template deleted successfully',
      data: null,
    });
  });
}
