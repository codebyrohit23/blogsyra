import { FileRepository } from './file.repository';
import { notFoundError } from '@/core/error';
import { FileDocument, FileLean } from './file.model';
import { CacheService } from '@/infra/cache';
import { Role } from '@/shared/constants';
import { MongoId } from '@/shared/types';
import { FileCacheKeys, FileCacheVersion } from './file.cache';
import { CloudinaryService } from '@/infra/storage';
import { CreateFileInput, FileOwnerRef, FileStatus, StorageProvider } from './file.types';

export class FileService {
  constructor(
    private readonly repo: FileRepository,
    private readonly cache: CacheService,
    private readonly fileCacheVersion: FileCacheVersion,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  public async uploadFile(
    file: Express.Multer.File,
    userId: MongoId,
    role: Role
  ): Promise<Partial<FileDocument>> {
    const uploaded = await this.cloudinaryService.uploadFile(file);

    const fileOwnerRef = role === Role.ADMIN ? FileOwnerRef.ADMIN : FileOwnerRef.USER;

    const uploadPayload = {
      storageProvider: StorageProvider.CLOUDINARY,
      bucket: uploaded.folder,
      key: uploaded.publicId,
      url: uploaded.url,
      mimeType: uploaded.resourceType,
      size: uploaded.bytes,
      ownerType: fileOwnerRef,
      ownerId: userId,
    };

    const fileDoc = await this.createFile(uploadPayload);

    return { url: fileDoc.url, size: fileDoc.size, mimeType: fileDoc.mimeType };
  }

  //   public async getFiles(query: FilePaginationDto): Promise<PaginationResult<FileLean>> {
  //     const version = await this.fileCacheVersion.getListVersion();

  //     const queryKey = buildQueryKey(query);

  //     const cacheKey = FileCacheKeys.list(queryKey, version);

  //     const cached = await this.cache.get<PaginationResult<FileLean>>(cacheKey);

  //     if (cached) return cached;

  //     const { page, limit, search, status, sortBy, sortOrder } = query;

  //     const filter: Record<string, any> = {};

  //     if (search) {
  //       filter.$or = [
  //         { name: { $regex: search, $options: 'i' } },
  //         { description: { $regex: search, $options: 'i' } },
  //       ];
  //     }

  //     if (status) {
  //       filter.status = status;
  //     }

  //     const sort: Record<string, 1 | -1> = {
  //       [sortBy]: sortOrder === SortOrder.ASC ? 1 : -1,
  //     };

  //     const result = await this.repo.paginate({
  //       filter,
  //       sort,
  //       page,
  //       limit,
  //     });

  //     if (result) {
  //       await this.cache.set(cacheKey, result);
  //     }

  //     return result;
  //   }

  private async createFile(payload: CreateFileInput): Promise<FileDocument> {
    const file = await this.repo.create(payload);

    await this.fileCacheVersion.bumpListVersion();

    return file;
  }

  public async getFile(id: MongoId): Promise<FileLean> {
    const cacheKey = FileCacheKeys.byId(id);

    const cached = await this.cache.get<FileLean>(cacheKey);

    if (cached) return cached;

    const file = await this.repo.findById(id);

    if (!file) throw notFoundError('File');

    await this.cache.set(cacheKey, file);

    return file;
  }

  public async deleteFileByUrl(url: string) {
    return this.repo.updateOne({ url }, { status: FileStatus.DELETED, deletedAt: new Date() });
  }
}
