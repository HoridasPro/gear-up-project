import { ActiveStatus, Role } from "../../../generated/prisma/enums";

export interface UserServiceInterface {
  name: string;
  email: string;
  password: string;
  role: Role;
  status: ActiveStatus;
  address?: string;
  profilePhoto?: string;
}
