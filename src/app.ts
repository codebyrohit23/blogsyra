import express, {
  Application,
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import responseTime from 'response-time';

// import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import hpp from 'hpp';
// import mongoSanitize from 'express-mongo-sanitize';

import v1Routes from '@/routes/v1';
// import { initRedis } from '@db/redis';
// import { AppError, logger } from '@utils/index';
import { globalErrorHandler } from './middlewares/index';
import { httpLogger } from './core/logger';
import { HttpStatus } from './shared/constants';
import { config } from './core/config';
import { ApiError } from './shared/utils';

import { setupSwagger } from '@/docs/swagger';

import '@/docs';

// If you have a versioned router, import it:
// import v1Router from "@/routes/v1";

/**
 * Core & security middlewares (order matters)
 */

export const app: Application = express();

// Swagger Docs
setupSwagger(app);

// behind proxy/load-balancer (Heroku/NGINX/K8s Ingress)
// app.set("trust proxy", true);

/**
 * Core & security middlewares (order matters)
 */

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

const corsOrigins = config.app.corsOrigin;
app.use(
  cors({
    origin: corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Sanitize against NoSQL injection
// app.use(mongoSanitize());

// Prevent HTTP param pollution (allow certain duplicates if needed)
app.use(
  hpp({
    whitelist: ['sort', 'fields'], // example if you need duplicates
  })
);

// Compression
app.use(compression());

app.use(responseTime());

app.use(httpLogger);

// app.use((req: Request, res: Response, next: NextFunction) => {
//   const start = Date.now();
//   res.on('finish', () => {
//     const duration = Date.now() - start;
//     logger.info(req, res, duration);
//   });
//   next();
// });

// Routes
app.use('/api/v1', v1Routes);
// ✅ Handle unknown routes
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new ApiError(`Can't find ${req.originalUrl} on this server!`, HttpStatus.NOT_FOUND));
});
// ✅ Global Error Handler
app.use(globalErrorHandler as ErrorRequestHandler);
