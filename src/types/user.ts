import { UserRole } from './enums';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
}
