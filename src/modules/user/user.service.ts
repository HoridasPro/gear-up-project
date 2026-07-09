import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { UserServiceInterface } from "./user.interface";
import config from "../../config";

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
      role,
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

export const userServiceDB = {
  createUserIntoDB,
};
