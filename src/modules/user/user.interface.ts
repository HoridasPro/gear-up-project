import { ActiveStatus, Role } from "../../../generated/prisma/enums";

export interface UserServiceInterface {
  name: string;
  email: string;
  password: string;
  role: Role;
  status: ActiveStatus;
  address?: string;
  profilePhoto?: Express.Multer.File | null;
}
// src/app/modules/user/user.interface.ts

export interface IUser {
  name?: string;
  address?: string;
  profilePhoto?: string;
}