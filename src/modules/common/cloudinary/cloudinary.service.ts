import fs from 'fs';
import path from 'path';
import cloudinary from './cloudinary.config';
import { UploadResult } from './cloudinary.type';
import { logger } from '@/core/logger';

export class CloudinaryService {
  private tempFolder = path.join(process.cwd(), 'uploads', 'temp');

  constructor() {
    // ensure local temp directory exists (for multer uploads)
    if (!fs.existsSync(this.tempFolder)) {
      fs.mkdirSync(this.tempFolder, { recursive: true });
    }
  }

  /**
   * Upload file to Cloudinary (default: temp folder)
   * @param localFilePath Path of local uploaded file
   * @param folder Cloud folder path (optional)
   */
  async uploadFile(localFilePath: string, folder: string = 'temp'): Promise<UploadResult> {
    try {
      const result = await cloudinary.uploader.upload(localFilePath, {
        folder,
        resource_type: 'auto',
      });

      // clean up local file
      this.safeDeleteLocalFile(localFilePath);

      return {
        publicId: result.public_id,
        url: result.secure_url,
        format: result.format,
        bytes: result.bytes,
        resourceType: result.resource_type,
        folder: result?.public_id.split('/')[0] || 'root',
      };
    } catch (error: any) {
      this.safeDeleteLocalFile(localFilePath);
      logger.error('Cloudinary upload error:', error);
      throw new Error('File upload failed');
    }
  }

  /**
   * Move a file from one folder to another (e.g. temp → /users/:id/profile)
   * @param publicId The Cloudinary public ID of the file
   * @param newFolder The new Cloudinary folder (e.g. "users/123/profile")
   */
  async moveFile(publicId: string, newFolder: string): Promise<UploadResult> {
    try {
      const fileName = publicId.split('/').pop()!;
      const newPublicId = `${newFolder}/${fileName}`;

      const result = await cloudinary.uploader.rename(publicId, newPublicId, {
        overwrite: true,
      });

      return {
        publicId: result.public_id,
        url: result.secure_url,
        format: result.format,
        bytes: result.bytes,
        resourceType: result.resource_type,
        folder: result?.public_id.split('/')[0] || 'root',
      };
    } catch (error: any) {
      logger.error('Cloudinary move error:', error);
      throw new Error('Failed to move file on Cloudinary');
    }
  }

  /**
   * Delete a file from Cloudinary
   * @param publicId The Cloudinary public ID
   */
  async deleteFile(publicId: string): Promise<boolean> {
    try {
      const res = await cloudinary.uploader.destroy(publicId, {
        resource_type: 'auto',
      });
      return res.result === 'ok' || res.result === 'not found';
    } catch (error: any) {
      logger.error('Cloudinary delete error:', error);
      throw new Error('File deletion failed');
    }
  }

  /**
   * Helper: Safely remove local file if it exists
   */
  private safeDeleteLocalFile(filePath: string) {
    try {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    } catch (err) {
      logger.warn(err, `Failed to delete temp file: ${filePath} : `);
    }
  }
}

export const cloudinaryService = new CloudinaryService();
