import { QueryFileInput, UpdateFileInput } from './schemas';
import { notFoundError } from '@errors/index';
import { FileDocument, FinalizeUpload, StorageProviderEnum } from './file.type';
import { FileRepository } from './file.repository';
import { AppError } from '@utils/index';
import { Types } from 'mongoose';
import { BaseService } from '@core/base.service';
import { PaginationResult } from '@core/base.repository';
import { cloudinaryService } from '@cloudinary/index';

export class FileService extends BaseService<FileDocument> {
  constructor() {
    super(new FileRepository());
  }
  // getFiles = async (query: QueryFileInput): Promise<PaginationResult<FileDocument>> => {
  //   const { page, limit, search, isActive, sortBy, sortOrder } = query;

  //   // Logic to fetch files based on validated query parameters
  //   const skip = (Number(page) - 1) * Number(limit);
  //   const filter: any = {};

  //   if (search) {
  //     filter.$or = [
  //       { name: { $regex: search, $options: 'i' } },
  //       { description: { $regex: search, $options: 'i' } },
  //     ];
  //   }

  //   if (isActive !== undefined) {
  //     query.isActive = isActive === true;
  //   }

  //   const sortOptions: { [key: string]: 1 | -1 } = {
  //     name: sortOrder === 'asc' ? 1 : -1,
  //     createdAt: sortOrder === 'asc' ? 1 : -1,
  //   };
  //   return this.findWithPagination(filter, { page, limit, sort: sortOptions });
  // };

  getFiles = async (query: QueryFileInput): Promise<PaginationResult<FileDocument>> => {
    const {
      page,
      limit,
      search,
      storageProvider,
      uploadStatus,
      used,
      isDeleted,
      ownerType,
      ownerId,
      sortBy,
      sortOrder,
    } = query;

    const filter: Record<string, any> = {};

    /* ---------- Search (match name, filename, bucket) ---------- */
    if (search) {
      filter.$or = [
        { originalName: { $regex: search, $options: 'i' } },
        { filename: { $regex: search, $options: 'i' } },
        { bucket: { $regex: search, $options: 'i' } },
      ];
    }

    /* ---------- Filters ---------- */
    if (storageProvider) filter.storageProvider = storageProvider;
    if (uploadStatus) filter.uploadStatus = uploadStatus;
    if (used !== undefined) filter.used = used;
    if (isDeleted !== undefined) filter.isDeleted = isDeleted;
    if (ownerType) filter.ownerType = ownerType;
    if (ownerId) filter.ownerId = ownerId;

    /* ---------- Sort Options ---------- */
    const sortOptions: Record<string, 1 | -1> = {
      [sortBy || 'createdAt']: sortOrder === 'asc' ? 1 : -1,
    };

    /* ---------- Reuse existing pagination helper ---------- */
    return this.findWithPagination(filter, { page, limit, sort: sortOptions });
  };

  upload = async (file: Express.Multer.File): Promise<FileDocument> => {
    const uploaded = await cloudinaryService.uploadFile(file.path);
    const uploadPayload = {
      storageProvider: StorageProviderEnum.CLOUDINARY,
      bucket: uploaded.folder,
      key: uploaded.publicId,
      url: uploaded.url,
      originalName: file.originalname,
      filename: file.filename,
      mimeType: uploaded.resourceType,
      size: uploaded.bytes,
    };
    return this.create(uploadPayload);
  };

  getFile = async (id: string): Promise<FileDocument> => {
    const file = await this.findById(id);
    if (!file) throw notFoundError('File');
    return file;
  };

  updateFile = async (payload: UpdateFileInput, id: string): Promise<FileDocument> => {
    const file = await this.updateById(id, payload);
    if (!file) throw notFoundError('File');
    return file;
  };

  deleteFile = async (id: string | Types.ObjectId): Promise<FileDocument> => {
    const file = await this.deleteById(id);
    if (!file) throw notFoundError('File');
    await cloudinaryService.deleteFile(file.key);
    return file;
  };

  finalizeUpload = async (payload: FinalizeUpload): Promise<FileDocument> => {
    const { id, folderName, ownerType, ownerId, resourceType, resourceId, uploadedBy } = payload;
    const file = await this.findById(id, { select: 'key' });
    if (!file) throw new AppError('File not found!');
    const uploadResult = await cloudinaryService.moveFile(file.key, folderName);
    const updateFilePayload: UpdateFileInput = {
      bucket: uploadResult?.folder,
      key: uploadResult?.publicId,
      url: uploadResult?.url,
      ownerType,
      ownerId,
      used: true,
      uploadedBy,
      resourceType,
      resourceId,
    };
    const fileDoc = await this.updateById(id, updateFilePayload);
    if (!fileDoc) throw new AppError('Failed to save file');
    return fileDoc;
  };
}
