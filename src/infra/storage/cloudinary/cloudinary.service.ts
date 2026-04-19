import fs from 'fs';
import path from 'path';
import cloudinary from './cloudinary.config';
import { UploadResult } from './cloudinary.type';
import { logger } from '@/core/logger';
import streamifier from 'streamifier';

export class CloudinaryService {
  private tempFolder = path.join(process.cwd(), 'uploads');

  constructor() {
    if (!fs.existsSync(this.tempFolder)) {
      fs.mkdirSync(this.tempFolder, { recursive: true });
    }
  }

  async uploadFile(file: Express.Multer.File, folder: string = 'uploads'): Promise<UploadResult> {
    try {
      const result = await new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder,
            resource_type: 'auto',
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );

        streamifier.createReadStream(file.buffer).pipe(stream);
      });

      return {
        publicId: result.public_id,
        url: result.secure_url,
        format: result.format,
        bytes: result.bytes,
        resourceType: result.resource_type,
        folder: result.public_id.split('/')[0] || 'root',
      };
    } catch (error) {
      logger.error(error, 'Cloudinary upload error:');
      throw new Error('File upload failed');
    }
  }

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
}

export const cloudinaryService = new CloudinaryService();
