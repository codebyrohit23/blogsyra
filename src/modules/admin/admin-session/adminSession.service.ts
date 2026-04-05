// import { AdminSessionDocument } from './adminSession.model';
// import { AdminSessionRepository } from './adminSession.repository';
// import { CreateSession } from './adminSession.type';

// export class AdminSessionService {
//   private readonly repo = new AdminSessionRepository();

//   async handleLoginSession(payload: CreateSession): Promise<AdminSessionDocument | null> {
//     const filter = { adminId: payload.admin };

//     const existingSession = await this.repo.findOne({ filter });

//     if (existingSession) {
//       const id = existingSession._id;

//       return this.repo.updateOne(
//         { _id: id },
//         {
//           adminId: payload.admin,
//           sessionId: payload.sessionId,
//           lastActiveAt: new Date(),
//           loggedInAt: new Date(),
//           isActive: true,
//           success: true,
//           os: payload.os ?? existingSession.os,
//           ip: payload.ip ?? existingSession.ip,
//           location: payload.location ?? existingSession.location,
//           fcmToken: payload.fcmToken ?? existingSession.fcmToken,
//         }
//       );
//     }

//     // 🔹 If no session exists, create a new one
//     return this.repo.create({
//       admin: payload.admin,
//       sessionId: payload.sessionId,
//       deviceId: payload.deviceId,
//       deviceType: payload.deviceType,
//       os: payload.os,
//       ip: payload.ip,
//       location: payload.location,
//       fcmToken: payload.fcmToken,
//       loggedInAt: new Date(),
//       lastActiveAt: new Date(),
//       isActive: true,
//       success: true,
//     });
//   }

//   async updateSessionActivity(sessionId: string, adminId: string): Promise<void> {
//     await this.repo.updateOne(
//       { sessionId, admin: adminId, isActive: true },
//       { lastActiveAt: new Date() }
//     );
//   }

//   async logoutSession(sessionId: string, adminId: string): Promise<void> {
//     await this.repo.updateOne(
//       { adminId, sessionId },
//       { isActive: false, lastActiveAt: new Date() }
//     );
//   }
// }
