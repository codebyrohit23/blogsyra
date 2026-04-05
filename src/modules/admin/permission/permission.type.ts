export enum ActionEnum {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  PUBLISH = 'publish',
}

export type PermissionType = {
  resource: string;
  action: ActionEnum;
};
