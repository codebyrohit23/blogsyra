// import { permissionSeeds } from './permission.seed.js';
// import { roleSeeds } from './role.seed.js';
// import { adminSeeds } from './admin.seed.js';
// import { logger } from '@/common/utils/index.js';
// import { dbConfig } from '@/config';
// import { connectDB, disConnectDB } from '@db/connection.js';
// import { LogMetadata } from '@/types/interfaces.js';

// export const runSeeds = async () => {
//   if (!dbConfig.SEED_DATABASE) return;
//   try {
//     await connectDB();
//     await permissionSeeds();
//     await roleSeeds();
//     await adminSeeds();
//   } catch (error) {
//     logger.error('Erroor in databse seeding : ', error as LogMetadata);
//   } finally {
//     await disConnectDB();
//   }
// };
