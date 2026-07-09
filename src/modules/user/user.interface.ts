import { Role, UserStatus } from "../../../generated/prisma/enums";

export interface UserServiceInterface {
  name: string;
  email: string;
  password: string;
  role: Role;
  status: UserStatus;
  address?: string;
  profilePhoto?: string;
}
