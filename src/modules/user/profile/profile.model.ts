// import { EntityStatus, Gender, MODELS } from '@/shared/constants';
// import { Schema, model, InferSchemaType, HydratedDocument, Types } from 'mongoose';

// const ProfileSchema = new Schema(
//   {
//     userId: {
//       type: Schema.Types.ObjectId,
//       ref: MODELS.USER.PROFILE,
//       required: true,
//     },

//     name: {
//       type: String,
//       required: true,
//     },

//     gender: {
//       type: String,
//       enum: Object.values(Gender),
//     },

//     bio: {
//       type: String,
//     },

//     dob: {
//       type: Date,
//     },

//     avatar: {
//       type: Schema.Types.ObjectId,
//       ref: MODELS.COMMON.FILE,
//     },

//     coverImage: {
//       type: Schema.Types.ObjectId,
//       ref: MODELS.COMMON.FILE,
//     },

//     status: {
//       type: String,
//       enum: EntityStatus,
//       default: EntityStatus.ACTIVE,
//     },
//   },
//   { timestamps: true }
// );

// ProfileSchema.index({ userId: 1 }, { unique: true });

// export const ProfileModel = model(MODELS.USER.CREDENTIAL, ProfileSchema);

// export type Profile = InferSchemaType<typeof ProfileSchema>;
// export type ProfileDocument = HydratedDocument<Profile>;
// export type ProfileLean = { _id: Types.ObjectId } & Profile;
