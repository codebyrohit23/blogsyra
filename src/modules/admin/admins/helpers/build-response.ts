import { AdminDocument, AdminLean } from '../admin.model';

export const buildAdminResponse = (admin: AdminDocument | AdminLean): Partial<AdminDocument> => {
  return {
    id: admin._id,
    name: admin.name,
    email: admin.email,
    // avatar: (admin.avatar as unknown as FileDocument)?.url ?? null,
    avatar: admin.avatar,
    status: admin.status,
    timezone: admin.timezone,
    language: admin.language,
  };
};
