// import { dbConfig } from '@/config';
// import { LogMetadata } from '@/types/interfaces';
// import { logger } from '@utils/logger';
// import mongoose from 'mongoose';

// export const connectDB = async (): Promise<void> => {
//   try {
//     await mongoose.connect(dbConfig.MONGO_URI);
//   } catch (error) {
//     logger.error('❌ Database connection error:', error as LogMetadata);
//     process.exit(1);
//   }
// };

// export const disConnectDB = async (): Promise<void> => {
//   try {
//     await mongoose.disconnect();
//   } catch (error) {
//     logger.error('Error while disconnecting DB:', error as LogMetadata);
//   }
// };
