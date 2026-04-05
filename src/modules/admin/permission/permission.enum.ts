import { ActionEnum } from './permission.type.js';

export const ADMIN_PERMISSIONS = {
  TEMPLATE: {
    CREATE: { resource: 'template', action: ActionEnum.CREATE } as const,
    READ: { resource: 'template', action: ActionEnum.READ } as const,
    UPDATE: { resource: 'template', action: ActionEnum.UPDATE } as const,
    DELETE: { resource: 'template', action: ActionEnum.DELETE } as const,
    PUBLISH: { resource: 'template', action: ActionEnum.PUBLISH } as const,
  },

  APP: {
    USER: {
      CREATE: { resource: 'user', action: ActionEnum.CREATE } as const,
      READ: { resource: 'user', action: ActionEnum.READ } as const,
      UPDATE: { resource: 'user', action: ActionEnum.UPDATE } as const,
      DELETE: { resource: 'user', action: ActionEnum.DELETE } as const,
    },
  },

  ADMIN: {
    PERMISSION: {
      CREATE: { resource: 'admin-permission', action: ActionEnum.CREATE } as const,
      READ: { resource: 'admin-permission', action: ActionEnum.READ } as const,
      UPDATE: { resource: 'admin-permission', action: ActionEnum.UPDATE } as const,
      DELETE: { resource: 'admin-permission', action: ActionEnum.DELETE } as const,
    },

    ROLE: {
      CREATE: { resource: 'admin-role', action: ActionEnum.CREATE } as const,
      READ: { resource: 'admin-role', action: ActionEnum.READ } as const,
      UPDATE: { resource: 'admin-role', action: ActionEnum.UPDATE } as const,
      DELETE: { resource: 'admin-role', action: ActionEnum.DELETE } as const,
    },
    ADMIN: {
      CREATE: { resource: 'admin', action: ActionEnum.CREATE } as const,
      READ: { resource: 'admin', action: ActionEnum.READ } as const,
      UPDATE: { resource: 'admin', action: ActionEnum.UPDATE } as const,
      DELETE: { resource: 'admin', action: ActionEnum.DELETE } as const,
    },
  },

  POST: {
    CREATE: { resource: 'post', action: ActionEnum.CREATE } as const,
    READ: { resource: 'post', action: ActionEnum.READ } as const,
    UPDATE: { resource: 'post', action: ActionEnum.UPDATE } as const,
    DELETE: { resource: 'post', action: ActionEnum.DELETE } as const,
    PUBLISH: { resource: 'post', action: ActionEnum.PUBLISH } as const,
  },

  FILE: {
    CREATE: { resource: 'file', action: ActionEnum.CREATE } as const,
    READ: { resource: 'file', action: ActionEnum.READ } as const,
    UPDATE: { resource: 'file', action: ActionEnum.UPDATE } as const,
    DELETE: { resource: 'file', action: ActionEnum.DELETE } as const,
    PUBLISH: { resource: 'file', action: ActionEnum.PUBLISH } as const,
  },
} as const;
