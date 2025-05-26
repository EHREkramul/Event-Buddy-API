import { UsersRole } from '../enums/user-role.enum';

export type CurrentUser = {
  id: number;
  role: UsersRole;
};
