import { ApiError } from '@/shared/utils';
import multer from 'multer';

// const uploadPath = path.join(process.cwd(), 'uploads');

// if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

// const storage = multer.diskStorage({
//   destination: (_, __, cb) => cb(null, uploadPath),

//   filename: (_, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//     cb(null, `${uniqueSuffix}-${file.originalname}`);
//   },
// });

// export const upload = multer({ storage });

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter: (_, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new ApiError('Only image files are allowed'));
    }
    cb(null, true);
  },
});
