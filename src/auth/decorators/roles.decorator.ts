import { SetMetadata } from '@nestjs/common';
import { UsersRole } from '../enums/user-role.enum';

export const ROLES_KEY = 'roles'; // Roles key for metadata.

export const Roles = (...roles: [UsersRole, ...UsersRole[]]) =>
  SetMetadata(ROLES_KEY, roles); // Set metadata for roles.
