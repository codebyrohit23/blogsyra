import { config } from '@/core/config';
import { logger } from '@/core/logger';
import mongoose, { Connection } from 'mongoose';

let connection: Connection;

// export const connectDB = async (): Promise<void> => {
//   try {
//     await mongoose.connect(config.db.mongoUri);
//   } catch (error) {
//     logger.error(error, '❌ Database connection error:');
//     process.exit(1);
//   }
// };

export const connectDB = async (): Promise<Connection> => {
  try {
    const conn = await mongoose.connect(config.db.mongoUri);
    connection = conn.connection;

    logger.info('✅ MongoDB connected');

    return connection;
  } catch (error) {
    logger.error(error);
    console.log(error);
    process.exit(1);
  }
};

export const getConnection = (): Connection => {
  if (!connection) {
    throw new Error('Database not connected');
  }
  return connection;
};

export const disConnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
  } catch (error) {
    logger.error(error, 'Error while disconnecting DB:');
  }
};
