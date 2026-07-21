import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { UserServiceInterface } from "./user.interface";
import config from "../../config";
import { ActiveStatus, Role } from "../../../generated/prisma/enums";

const createUserIntoDB = async (payload: UserServiceInterface) => {
  const { name, email, password, role, status, address, profilePhoto } =
    payload;
  const isUserExist = await prisma.user.findUnique({
    where: { email },
  });

  if (isUserExist) {
    throw new Error("User already exist");
  }

  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_sounds),
  );
  const createUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: role.toUpperCase() as Role,
      status,
      address,
      profilePhoto,
    },
  });

  const user = await prisma.user.findUnique({
    where: {
      email: createUser.email,
    },
    omit: {
      password: true,
    },
  });
  return user;
};

const getMyProfileIntoDB = async (id: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
    omit: { password: true },
  });

  return user;
};

const getAllUsersFromDB = async () => {
  const result = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    omit: {
      password: true,
    },
  });

  return result;
};

const updateUserStatusIntoDB = async (
  id: string,
  payload: {
    status: ActiveStatus;
  },
) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const result = await prisma.user.update({
    where: {
      id,
    },
    data: {
      status: payload.status.toUpperCase() as ActiveStatus,
    },
  });

  return result;
};

export const userServiceDB = {
  createUserIntoDB,
  getMyProfileIntoDB,
  getAllUsersFromDB,
  updateUserStatusIntoDB,
};
