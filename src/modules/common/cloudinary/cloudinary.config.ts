import { cloudinaryConfig } from '@/config/index';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: cloudinaryConfig.CLOUD_NAME,
  api_key: cloudinaryConfig.API_KEY,
  api_secret: cloudinaryConfig.API_SECRET,
  secure: true,
});

export default cloudinary;
