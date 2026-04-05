// import {
//   accountBlockedHandler,
//   accountDeactivatedHandler,
//   accountDeletedHandler,
//   accountLockedHandler,
//   accountSuspendedHandler,
//   alreadyExistsError,
//   invalidCredentialError,
//   jwtExpiredError,
//   jwtInvalidError,
//   notFoundError,
// } from '@errors/index';

// import { AppError, logger } from '@utils/index';
// import { LogMetadata, RoleEnum } from '@/types';
// import { AdminDocument, AdminService, CreateAdminInput } from '@admin/admins';

// import { AdminDeviceSessionService } from '@admin/adminDeviceSession';
// import { ChangePasswordInput, LoginInput, resetPassswordInput, updateInput } from './schemas/auth';
// import {
//   GenerateResetPasswordInput,
//   TokenManager,
//   TokenPairResult,
//   TokenResult,
// } from '@token/index';
// // import { OtpDocument, OtpEnum, OtpService } from '@otp';

// import { Types } from 'mongoose';
// import { v4 as uuidv4 } from 'uuid';
// import {
//   GenerateOtpResult,
//   GenrateRestePasswordTokenPayload,
//   OtpManager,
//   OtpService,
// } from '@otp/index';

// import { ForgotPasswordWithOtp, VerifyForgotPasswordhOtp } from './auth.type';
// import { FileOwnerEnum, FileResourceEnum, FileService, generateCloudPath } from '@file/index';

// export class AuthService {
//   private adminService = new AdminService();
//   private adminSessionService = new AdminDeviceSessionService();
//   private otpService = new OtpService();
//   private fileService = new FileService();

//   register = async (payload: CreateAdminInput): Promise<AdminDocument> => {
//     const { email, username, roles } = payload;
//     const isExistWithEmail = await this.adminService.findOne({ email });
//     if (isExistWithEmail) throw alreadyExistsError('admin', 'email');
//     const isExistWithUsername = await this.adminService.findOne({ username });
//     if (isExistWithUsername) throw alreadyExistsError('admin', 'username');
//     const rolesObjectIds = roles.map((id) => new Types.ObjectId(id));
//     let avatar;
//     if (payload.avatar) {
//       const file = await this.fileService.findById(payload.avatar);
//       if (file) avatar = payload?.avatar ? new Types.ObjectId(payload?.avatar) : undefined;
//     }

//     const admin = await this.adminService.create({ ...payload, roles: rolesObjectIds, avatar });
//     // finailize uplaod
//     if (avatar) {
//       const folderName = generateCloudPath({
//         ownerType: FileOwnerEnum.ADMIN,
//         ownerId: admin?._id?.toString(),
//         resourceType: FileResourceEnum.PROFILE,
//       });

//       await this.fileService.finalizeUpload({
//         id: avatar,
//         folderName,
//         ownerType: FileOwnerEnum.ADMIN,
//         ownerId: admin?._id?.toString(),
//         resourceType: FileResourceEnum.PROFILE,
//         resourceId: admin?._id?.toString(),
//         uploadedBy: admin?._id?.toString(),
//       });
//     }
//     return admin;
//   };

//   login = async (payload: LoginInput, res : Response) => {
//     const { identifier, password, deviceId, deviceType, fcmToken } = payload;
//     const query = { $or: [{ email: identifier }, { username: identifier }] };
//     const options = {
//       projection: '+password +isDeleted +isBlocked +isSuspended +suspendedUntil +loginAttempts',
//     };
//     const admin = await this.adminService.findOne(query, options);
//     if (!admin) throw invalidCredentialError();
//     if (!(await admin.comparePassword(password))) {
//       await admin.incrementLoginAttempts();
//       const payload = {
//         admindId: admin._id,
//         deviceId,
//         deviceType,
//         fcmToken,
//       };
//       // this.adminSessionService.handleLoginSession(payload);
//       throw invalidCredentialError();
//     }
//     if (!admin.isActive) throw  ();
//     if (admin.isDeleted) throw accountDeletedHandler();
//     if (admin.isBlocked) throw accountBlockedHandler();
//     if (await admin.isAccountLocked()) throw accountLockedHandler();
//     if (await admin.isAccountSuspended()) throw accountSuspendedHandler();

//     const tokenPayload = {
//       id: admin._id.toString(),
//       role: RoleEnum.ADMIN,
//       deviceId,
//       sessionId: uuidv4(),
//     };
//     const tokens = await TokenManager.generateTokenPair(tokenPayload);
//     const sessionPayload = {
//       admin: admin._id,
//       deviceId,
//       deviceType,
//       sessionId: tokenPayload.sessionId,
//     };
//     const adminPayload = {
//       _id: admin._id,
//       firstName: admin.firstName,
//       lastName: admin.lastName,
//       email: admin.email,
//       username: admin.username,
//       phone: admin.phone,
//       roles: admin.roles,
//       department: admin.department,
//       jobTitle: admin.jobTitle,
//       isActive: admin.isActive,
//       avatar: admin.avatar,
//       timezone: admin.timezone,
//       language: admin.language,
//       createdBy: admin.createdBy,
//       updatedBy: admin.updatedBy,
//       notes: admin.notes,
//     };

//     await this.adminSessionService.handleLoginSession(sessionPayload);
//     return { admin: adminPayload as AdminDocument, tokens };
//   };

//   logout = async (payload: string, id: string) => {
//     const accessToken = await TokenManager.verifyAccessToken(payload);
//     const { sessionId } = accessToken;
//     await Promise.all([
//       TokenManager.revokeSession(sessionId),
//       this.adminSessionService.logoutSession(sessionId, id),
//     ]);
//   };

//   refresh = async (payload: string): Promise<TokenPairResult> => {
//     return TokenManager.refrehAcccessToken(payload);
//   };

//   /*
//   // With databse model
//   // forgotPasswordWithOtp = async (payload: ForgotPasswordWithOtp): Promise<OtpDocument> => {
//   //   const { email } = payload;
//   //   const admin = await this.adminService.findOne({ email });
//   //   if (!admin) throw notFoundError('Account', 'email', email);
//   //   const otpPayload = {
//   //     type: payload.type,
//   //     targetId: admin._id,
//   //     role: payload.role,
//   //     channel: payload.channel,
//   //     expiryTime: payload.expiryTime,
//   //   };
//   //   return this.otpService.createOtp(otpPayload);
//   // };

//   // verifyForgotPasswordOtp = async (payload: VerifyForgotPasswordhOtp): Promise<void> => {
//   //   const { email } = payload;
//   //   const admin = await this.adminService.findOne({ email });
//   //   if (!admin) throw notFoundError('Account', 'email', email);
//   //   const otpPayload = {
//   //     otp: payload.otp,
//   //     type: payload.type,
//   //     targetId: admin._id,
//   //     role: payload.role,
//   //     channel: payload.channel,
//   //   };
//   //   const isVerify = await this.otpService.verifyOtp(otpPayload);
//   //   if (!isVerify) throw new AppError('Invalid Otp');
//   // };

//   */

//   // with redis
//   forgotPasswordWithOtp = async (payload: ForgotPasswordWithOtp): Promise<GenerateOtpResult> => {
//     const { email } = payload;
//     const admin = await this.adminService.findOne({ email });
//     if (!admin) throw notFoundError('Account', 'email', email);
//     return OtpManager.generateOtp(payload.type, admin._id?.toString());
//   };

//   getResetPasswordTokenWithEmail = async (
//     payload: GenrateRestePasswordTokenPayload
//   ): Promise<TokenResult> => {
//     const { email, deviceId } = payload;
//     const admin = await this.adminService.findOne({ email }, { select: '_id' });
//     if (!admin) throw notFoundError('Account', 'email', email);
//     const resetPasswordTokenPayload: GenerateResetPasswordInput = {
//       id: admin._id?.toString(),
//       deviceId,
//       role: RoleEnum.ADMIN,
//     };
//     return TokenManager.setResetPasswordToken(resetPasswordTokenPayload);
//   };

//   verifyForgotPasswordOtp = async (payload: VerifyForgotPasswordhOtp): Promise<void> => {
//     const { email } = payload;
//     const admin = await this.adminService.findOne({ email });
//     if (!admin) throw notFoundError('Account', 'email', email);
//     const isVerify = await OtpManager.verifyOtp(payload.type, admin._id?.toString(), payload.otp);

//     if (!isVerify) throw new AppError('Invalid Otp');
//   };

//   resetPassword = async (payload: resetPassswordInput): Promise<void> => {
//     const { newPassword, token } = payload;
//     const { sub } = await TokenManager.verifyResetPasswordToken(token);
//     await this.adminService.updateById(sub, { password: newPassword });
//   };

//   changePassword = async (payload: ChangePasswordInput, id: string): Promise<void> => {
//     const { currentPassword, newPassword } = payload;
//     const admin = await this.adminService.findById(id, {
//       projection: '+password +passwordChangedAt',
//     });
//     if (!admin) throw jwtExpiredError();
//     if (!admin.comparePassword(currentPassword))
//       throw new AppError('The current password you entered is incorrect.');
//     await this.adminService.updateById(id, { password: newPassword });
//   };

//   getMe = async (id: string): Promise<AdminDocument> => {
//     const options = {
//       populate: [
//         { path: 'roles', match: { isActive: true } },
//         { path: 'avatar', match: { isDeleted: false } },
//         {
//           path: 'roles',
//           populate: {
//             path: 'permissions',
//             match: { isActive: true },
//             select: 'action resource description',
//           },
//         },
//       ],
//     };
//     const admin = await this.adminService.findById(id, options);
//     if (!admin) throw jwtInvalidError();
//     return admin;
//   };

//   updateMe = async (payload: updateInput, id: string): Promise<AdminDocument> => {
//     const admin = await this.adminService.updateById(id, payload);
//     if (!admin) throw notFoundError('Admin');

//     if (payload.avatar && admin) {
//       const file = await this.fileService.findById(payload.avatar);
//       if (file) {
//         const folderName = generateCloudPath({
//           ownerType: FileOwnerEnum.ADMIN,
//           ownerId: admin?._id?.toString(),
//           resourceType: FileResourceEnum.PROFILE,
//         });

//         await this.fileService.finalizeUpload({
//           id: payload.avatar,
//           folderName,
//           ownerType: FileOwnerEnum.ADMIN,
//           ownerId: admin?._id?.toString(),
//           resourceType: FileResourceEnum.PROFILE,
//           resourceId: admin?._id?.toString(),
//           uploadedBy: admin?._id?.toString(),
//         });
//       }
//     }
//     const updatedAdmin = await this.adminService.updateById(id, payload);

//     if (!updatedAdmin) throw new AppError('Failed to update profile');

//     // remove old image if avatar updated
//     if (
//       payload?.avatar &&
//       admin?.avatar &&
//       updatedAdmin &&
//       payload.avatar !== admin?.avatar?.toString()
//     ) {
//       await this.fileService.deleteFile(admin.avatar);
//     }
//     return updatedAdmin;
//   };
// }
