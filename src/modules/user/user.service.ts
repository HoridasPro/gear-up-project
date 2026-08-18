import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { UserServiceInterface } from "./user.interface";
import config from "../../config";
import { ActiveStatus, Role } from "../../../generated/prisma/enums";
import { uploadImageToImgBB } from "../../utils/uploadImageToImgBB";
import { IUser } from "./user.interface";

const createUserIntoDB = async (payload: UserServiceInterface) => {
  const { name, email, password, role, status, address, profilePhoto } =
    payload;

  const isUserExist = await prisma.user.findUnique({
    where: { email },
  });

  if (isUserExist) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_sounds),
  );

  let imageUrl: string | null = null;

  if (profilePhoto) {
    imageUrl = await uploadImageToImgBB(profilePhoto);
  }

  const createUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: role.toUpperCase() as Role,
      status,
      address,
      profilePhoto: imageUrl,
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

const getAllUsersFromDB = async (
  search: string = "",
  page: number = 1,
  limit: number = 10,
) => {
  const skip = (page - 1) * limit;

  const where = search
    ? {
        OR: [
          {
            name: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
          {
            email: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
        ],
      }
    : {};

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      omit: {
        password: true,
      },
    }),

    prisma.user.count({
      where,
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    users,
    total,
    page,
    limit,
    totalPages,
  };
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

const updateMyProfile = async (userId: string, payload: Partial<IUser>) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      ...(payload.name !== undefined && {
        name: payload.name,
      }),

      ...(payload.address !== undefined && {
        address: payload.address,
      }),

      ...(payload.profilePhoto !== undefined && {
        profilePhoto: payload.profilePhoto,
      }),
    },
    select: {
      id: true,
      name: true,
      email: true,
      address: true,
      profilePhoto: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return updatedUser;
};
const updateUserRoleIntoDB = async (
  id: string,
  role: "CUSTOMER" | "PROVIDER" | "ADMIN",
) => {
  const result = await prisma.user.update({
    where: {
      id,
    },
    data: {
      role,
    },
  });

  return result;
};

export const AdminServices = {
  updateUserRoleIntoDB,
};

export const userServiceDB = {
  createUserIntoDB,
  getMyProfileIntoDB,
  getAllUsersFromDB,
  updateUserStatusIntoDB,
  updateMyProfile,
  updateUserRoleIntoDB,
};
