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

// const getAllUsersFromDB = async (
//   search: string = "",
//   page: number = 1,
//   limit: number = 10,
// ) => {
//   const skip = (page - 1) * limit;

//   const where = search
//     ? {
//         OR: [
//           {
//             name: {
//               contains: search,
//               mode: "insensitive" as const,
//             },
//           },
//           {
//             email: {
//               contains: search,
//               mode: "insensitive" as const,
//             },
//           },
//         ],
//       }
//     : {};

//   const [users, total] = await Promise.all([
//     prisma.user.findMany({
//       where,
//       skip,
//       take: limit,
//       orderBy: {
//         createdAt: "desc",
//       },
//       omit: {
//         password: true,
//       },
//     }),

//     prisma.user.count({
//       where,
//     }),
//   ]);
//   console.log("Total:", total);
//   console.log("Total Pages:", Math.ceil(total / limit));
//   return {
//     users,
//     totalPages: Math.ceil(total / limit),
//   };
// };
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

export const userServiceDB = {
  createUserIntoDB,
  getMyProfileIntoDB,
  getAllUsersFromDB,
  updateUserStatusIntoDB,
};
