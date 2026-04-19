import { Request, Response } from 'express';
import { FileService } from './file.service';
import { HttpStatus } from '@/shared/constants';
import { FileDocument, FileLean } from './file.model';
import { ApiError, asyncHandler, sendResponse } from '@/shared/utils';
import { ApiResponse } from '@/shared/types';

export class FileController {
  constructor(private readonly fileService: FileService) {}

  //   getFiles = asyncHandler(async (req: Request, res: Response<ApiResponse<Array<FileLean>>>) => {
  //     const query = filePaginationSchema.parse(req.query);

  //     const result = await this.fileService.getFiles(query);

  //     sendResponse(res, {
  //       statusCode: HttpStatus.OK,
  //       data: result.data,
  //       pagination: result.pagination,
  //     });
  //   });

  uploadFile = asyncHandler(
    async (req: Request, res: Response<ApiResponse<Partial<FileDocument>>>) => {
      if (!req.file) {
        throw new ApiError('File is required');
      }

      const fileDoc = await this.fileService.uploadFile(req.file, req.user.sub, req.user.role);

      sendResponse(res, {
        statusCode: HttpStatus.CREATED,
        message: 'File uploaded successfully',
        data: fileDoc,
      });
    }
  );

  getFile = asyncHandler(async (req: Request, res: Response<ApiResponse<FileLean>>) => {
    const file = await this.fileService.getFile(req.params.id);

    sendResponse(res, {
      statusCode: HttpStatus.OK,
      data: file,
    });
  });
}
