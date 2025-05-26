import { UserRole } from '../enums/user-role.enum';

export type CurrentUser = {
  id: number;
  role: UserRole;
};
