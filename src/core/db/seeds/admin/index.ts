// import { dbConfig } from '@/config';
// import { seedPermissions } from './permission-seeds';
// import { connectDB, disConnectDB } from '@/core/db/connection';

// export const runSeeds = async (): Promise<void> => {
//   if (!dbConfig.SEED_DATABASE) return;
//   try {
//     await connectDB();
//     await seedPermissions();
//     seedPermissions();
//   } finally {
//     await disConnectDB();
//   }
// };
