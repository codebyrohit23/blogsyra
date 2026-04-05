import { BaseRepository } from '@core/base.repository';
import { AppError, asyncHandler, sendResponse } from '@utils/index';
import { FileService } from './file.service';
import { FileDocument } from './file.type';
import { File } from './file.model';
import { queryFileSchema } from './schemas';
import { Request, Response } from 'express';
import { ApiResponse } from '@/types';
import { HttpStatus } from '@/constants/enums';

export class FileController extends BaseRepository<FileDocument> {
  constructor() {
    super(File);
  }

  private fileService = new FileService();

  getFiles = asyncHandler(async (req: Request, res: Response<ApiResponse<FileDocument[]>>) => {
    const query = queryFileSchema.parse(req.query);
    const files = await this.fileService.getFiles(query);
    sendResponse(res, {
      statusCode: HttpStatus.OK,
      message: 'Admin created successfully',
      data: files.data,
      pagination: files.pagination,
    });
  });

  upload = asyncHandler(async (req: Request, res: Response<ApiResponse<FileDocument>>) => {
    const file = req.file;
    if (!file) throw new AppError('File required');
    const fileDoc = await this.fileService.upload(file);
    sendResponse<FileDocument>(res, {
      statusCode: HttpStatus.CREATED,
      message: 'File uploaded successfully',
      data: fileDoc,
    });
  });

  getFile = asyncHandler(async (req: Request, res: Response<ApiResponse<FileDocument>>) => {
    const id = req.params.id;
    const File = await this.fileService.getFile(id);
    sendResponse(res, {
      statusCode: HttpStatus.CREATED,
      data: File,
    });
  });
  updateFile = asyncHandler(async (req: Request, res: Response<ApiResponse<FileDocument>>) => {
    const id = req.params.id;
    const File = await this.fileService.updateFile(req.body, id);
    sendResponse(res, {
      statusCode: HttpStatus.CREATED,
      message: 'File updated successfully',
      data: File,
    });
  });
  deleteFile = asyncHandler(async (req: Request, res: Response<ApiResponse<null>>) => {
    const id = req.params.id;
    await this.fileService.deleteFile(id);
    sendResponse(res, {
      statusCode: HttpStatus.CREATED,
      message: 'File delted successfully',
      data: null,
    });
  });
}
