import mongoose, { HydratedDocument, InferSchemaType, Schema, Types } from 'mongoose';

import { DEFAULT_LANGUAGE, DEFAULT_TIMEZONE, EntityStatus, MODELS } from '@/shared/constants';
import { EMAIL_REGEX } from '@/shared/utils';
import { AccountStatus } from '@/shared/constants/enums';

const AdminSchema = new Schema(
  {
    // Basic Information
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    // lastName: {
    //   type: String,
    //   required: [true, 'Last name is required'],
    //   trim: true,
    //   minlength: [2, 'Last name must be at least 2 characters'],
    //   maxlength: [50, 'Last name cannot exceed 50 characters'],
    // },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [EMAIL_REGEX, 'Please enter a valid email'],
      index: true,
    },
    // username: {
    //   type: String,
    //   required: [true, 'Username is required'],
    //   unique: true,
    //   trim: true,
    //   lowercase: true,
    //   minlength: [3, 'Username must be at least 3 characters'],
    //   maxlength: [30, 'Username cannot exceed 30 characters'],
    //   match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers and underscores'],
    //   index: true,
    // },
    // phone: {
    //   type: String,
    //   trim: true,
    //   match: [PHONE_REGEX, 'Please enter a valid phone number'],
    // },

    // Authentication
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },
    passwordChangedAt: {
      type: Date,
      select: false,
    },
    // passwordResetToken: {
    //   type: String,
    //   select: false,
    // },
    // passwordResetExpires: {
    //   type: Date,
    //   select: false,
    // },

    // Role-Based Access Control
    roleId: {
      type: Schema.Types.ObjectId,
      ref: MODELS.ADMIN.ROLE,
    },

    // isBlocked: {
    //   type: Boolean,
    //   default: false,
    //   select: false,
    // },
    // isSuspended: {
    //   type: Boolean,
    //   default: false,
    //   select: false,
    // },
    // isDeleted: {
    //   type: Boolean,
    //   default: false,
    //   index: true,
    // },
    // suspendedUntil: {
    //   type: Date,
    //   select: false,
    // },
    // suspensionReason: {
    //   type: String,
    //   trim: true,
    //   maxlength: [500, 'Suspension reason cannot exceed 500 characters'],
    //   select: false,
    // },

    // Security & Login Tracking
    // loginAttempts: {
    //   type: new mongoose.Schema(
    //     {
    //       count: { type: Number, default: 0 },
    //       lockedUntil: { type: Date },
    //     },
    //     { _id: false }
    //   ),
    //   select: false,
    // },

    // Profile
    avatar: {
      type: Schema.Types.ObjectId,
      ref: MODELS.COMMON.FILE,
    },

    timezone: {
      type: String,
      default: DEFAULT_TIMEZONE,
    },
    language: {
      type: String,
      default: DEFAULT_LANGUAGE,
      maxlength: [5, 'Language code cannot exceed 5 characters'],
    },

    // Account Status
    status: {
      type: String,
      enum: Object.values(AccountStatus),
      default: AccountStatus.ACTIVE,
    },

    // Metadata
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Notes cannot exceed 1000 characters'],
    },

    // Audit Fields
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: MODELS.ADMIN.ADMIN,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: MODELS.ADMIN.ADMIN,
    },
  },
  {
    timestamps: true,
    collection: 'admins',
  }
);

// Indexes
AdminSchema.index({ role: 1 });
AdminSchema.index({ email: 1, status: 1 });
AdminSchema.index({ createdAt: -1 });

// Text search index
AdminSchema.index({
  name: 'text',
  email: 'text',
});

// AdminSchema.virtual('fullName').get(function () {
//   return `${this.firstName} ${this.lastName}`;
// });

// Pre-save middleware for password hashing
// AdminSchema.pre('save', async function (next: (err?: CallbackError) => void) {
//   if (!this.isModified('password')) return next();

//   try {
//     const salt = await bcrypt.genSalt(authConfig.SALT_ROUNDS);
//     this.password = await bcrypt.hash(this.password, salt);
//     this.passwordChangedAt = new Date();
//     next();
//   } catch (error) {
//     next(error as CallbackError);
//   }
// });

// Instance Methods
// AdminSchema.methods = {
//   // Compare password
//   async comparePassword(candidatePassword: string) {
//     return await bcrypt.compare(candidatePassword, this.password);
//   },

//   // Generate password reset token
//   generatePasswordResetToken() {
//     const resetToken = crypto.randomBytes(32).toString('hex');
//     this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
//     this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
//     return resetToken;
//   },

//   // Check if account is locked
//   isAccountLocked() {
//     return this.loginAttempts?.lockedUntil && this.loginAttempts.lockedUntil > Date.now();
//   },

//   // Check if account is suspended
//   isAccountSuspended() {
//     return this.isSuspended && (!this.suspendedUntil || this.suspendedUntil > Date.now());
//   },

//   // Increment login attempts
//   async incrementLoginAttempts() {
//     if (this.loginAttempts.lockedUntil && this.loginAttempts.lockedUntil < Date.now()) {
//       return this.updateOne({
//         $unset: { 'loginAttempts.lockedUntil': 1 },
//         $set: { 'loginAttempts.count': 1 },
//       });
//     }

//     const updates = {
//       $inc: { 'loginAttempts.count': 1 },
//     };

//     if (this.loginAttempts.count + 1 >= 5) {
//       updates.$set = { 'loginAttempts.lockedUntil': new Date(Date.now() + 2 * 60 * 60 * 1000) }; // 2 hours
//     }

//     return this.updateOne(updates);
//   },

//   // Reset login attempts
//   async resetLoginAttempts() {
//     const updates: UpdateQuery<> = {
//       $set: { 'loginAttempts.count': 0 },
//       $unset: { 'loginAttempts.lockedUntil': 1 },
//     };

//     return this.updateOne(updates);
//   },

//   // Add device and login history
//   async addDeviceLogin(deviceData: DeviceInfo) {
//     // Update current device
//     this.currentDevice = {
//       deviceId: deviceData.deviceId,
//       deviceType: deviceData.deviceType || 'web',
//       os: deviceData.os,
//       ip: deviceData.ip,
//       location: deviceData.location,
//       fcmToken: deviceData.fcmToken,
//       loggedInAt: new Date(),
//       lastActiveAt: new Date(),
//       isActive: true,
//     };

//     // Add to login history (keep only last 50 entries)
//     if (this.loginHistory.length >= 50) {
//       this.loginHistory = this.loginHistory.slice(-49);
//     }

//     this.loginHistory.push({
//       deviceId: deviceData.deviceId,
//       deviceType: deviceData.deviceType || 'web',
//       ip: deviceData.ip,
//       location: deviceData.location,
//       loggedInAt: new Date(),
//       success: true,
//     });

//     return this.save();
//   },

//   // Add failed login attempt to history
//   async addFailedLogin(deviceData: DeviceInfo) {
//     // Add to login history
//     if (this.loginHistory.length >= 50) {
//       this.loginHistory = this.loginHistory.slice(-49);
//     }

//     this.loginHistory.push({
//       deviceId: deviceData.deviceId || 'unknown',
//       deviceType: deviceData.deviceType || 'web',
//       ip: deviceData.ip,
//       location: deviceData.location,
//       loggedInAt: new Date(),
//       success: false,
//     });

//     return this.save();
//   },

//   // Update device activity
//   async updateDeviceActivity() {
//     if (this.currentDevice && this.currentDevice.isActive) {
//       this.currentDevice.lastActiveAt = new Date();
//       return this.save();
//     }
//     return false;
//   },

//   // Logout from current device
//   async logoutDevice() {
//     if (this.currentDevice) {
//       this.currentDevice.isActive = false;
//       this.currentDevice.fcmToken = null;
//       return this.save();
//     }
//     return false;
//   },

//   // Soft delete
//   async softDelete(deletedBy: Schema.Types.ObjectId) {
//     this.isDeleted = true;
//     this.isActive = false;
//     this.updatedBy = deletedBy;
//     return this.save();
//   },

//   // Restore
//   async restore(restoredBy: Schema.Types.ObjectId) {
//     this.isDeleted = false;
//     this.isActive = true;
//     this.updatedBy = restoredBy;
//     return this.save();
//   },

//   // Block account
//   async block(reason: string, blockedBy: Schema.Types.ObjectId) {
//     this.isBlocked = true;
//     this.isActive = false;
//     this.suspensionReason = reason;
//     this.updatedBy = blockedBy;
//     return this.save();
//   },

//   // Suspend account
//   async suspend(reason: string, suspendedUntil: Date, suspendedBy: Schema.Types.ObjectId) {
//     this.isSuspended = true;
//     this.suspendedUntil = suspendedUntil;
//     this.suspensionReason = reason;
//     this.updatedBy = suspendedBy;
//     return this.save();
//   },

//   // Activate account
//   async activate(activatedBy: Schema.Types.ObjectId) {
//     this.isActive = true;
//     this.isBlocked = false;
//     this.isSuspended = false;
//     this.suspendedUntil = null;
//     this.suspensionReason = null;
//     this.updatedBy = activatedBy;
//     return this.save();
//   },
// };

export const AdminModel = mongoose.model(MODELS.ADMIN.ADMIN, AdminSchema);

export type Admin = InferSchemaType<typeof AdminSchema>;

// export type CreateAdminInput = Omit<Admin, 'status' | 'createdAt' | 'updatedAt'>;
// export type UpdateAdminInput = Partial<Omit<Admin, 'createdAt' | 'updatedAt'>>;

export type AdminDocument = HydratedDocument<Admin>;
export type AdminLean = { _id: Types.ObjectId } & Admin;
