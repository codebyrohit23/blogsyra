import { EntityStatus } from '@/shared/constants';

export interface RoleBase {
  name: string;
  isSuperAdmin?: boolean;
  permissions: Array<string>;
  description: string;
  status?: EntityStatus;
}

export type CreateRoleInput = RoleBase;

export type UpdateRoleInput = Partial<RoleBase>;
