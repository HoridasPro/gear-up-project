import { RentalStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { IRentalOrder } from "./rentalOrder.interface";

const createRentalIntoDB = async (
  payload: IRentalOrder,
  customerId: string,
) => {
  const gearItem = await prisma.gearItem.findUnique({
    where: {
      id: payload.gearItemId,
    },
  });

  if (!gearItem) {
    throw new Error("Gear item not found");
  }

  if (gearItem.quantity < payload.quantity) {
    throw new Error("Insufficient quantity");
  }

  const startDate = new Date(payload.startDate);
  const endDate = new Date(payload.endDate);

  if (startDate >= endDate) {
    throw new Error("End date must be after start date");
  }

  const days = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  const totalPrice = gearItem.price * payload.quantity * days;

  const rentalOrder = await prisma.rentalOrder.create({
    data: {
      gearItemId: payload.gearItemId,
      customerId,
      quantity: payload.quantity,
      totalPrice,
      startDate,
      endDate,
    },
  });

  await prisma.gearItem.update({
    where: {
      id: payload.gearItemId,
    },
    data: {
      quantity: gearItem.quantity - payload.quantity,
    },
  });

  return rentalOrder;
};
// const createRentalIntoDB = async (
//   payload: IRentalOrder,
//   customerId: string,
// ) => {
//   // ১. Prisma Transaction ব্যবহার করা হচ্ছে যেন দুটি কাজ একসাথে হয়
//   return await prisma.$transaction(async (tx) => {
//     // Gear item খোঁজা
//     const gearItem = await tx.gearItem.findUnique({
//       where: {
//         id: payload.gearItemId,
//       },
//     });

//     if (!gearItem) {
//       throw new Error("Gear item not found");
//     }

//     // ২. স্টক চেক (ভুল চিহ্নিত করার জন্য বর্তমান স্টক প্রিন্ট করতে পারেন)
//     if (gearItem.quantity < payload.quantity) {
//       throw new Error(
//         `Insufficient quantity. Available stock: ${gearItem.quantity}, Requested: ${payload.quantity}`,
//       );
//     }

//     const startDate = new Date(payload.startDate);
//     const endDate = new Date(payload.endDate);

//     if (startDate >= endDate) {
//       throw new Error("End date must be after start date");
//     }

//     // দিন গণনা
//     const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
//     const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

//     if (days <= 0) {
//       throw new Error("Rental duration must be at least 1 day");
//     }

//     const totalPrice = gearItem.price * payload.quantity * days;

//     // ৩. রেন্টাল অর্ডার তৈরি
//     const rentalOrder = await tx.rentalOrder.create({
//       data: {
//         gearItemId: payload.gearItemId,
//         customerId,
//         quantity: payload.quantity,
//         totalPrice,
//         startDate,
//         endDate,
//       },
//     });

//     // ৪. স্টক কমানো
//     await tx.gearItem.update({
//       where: {
//         id: payload.gearItemId,
//       },
//       data: {
//         quantity: {
//           decrement: payload.quantity, // সরাসরি Prisma-র decrement ব্যবহার করা নিরাপদ
//         },
//       },
//     });

//     return rentalOrder;
//   });
// };
const allGetMyRentalOrdersFromDB = async (customerId: string) => {
  const result = await prisma.rentalOrder.findMany({
    where: {
      customerId,
    },
    include: {
      gearItem: true,
    },
    orderBy: {
      rentalDate: "desc",
    },
  });

  if (!result) {
    throw new Error("Rental orders not found");
  }

  return result;
};

const getSingleRentalOrderFromDB = async (id: string, customerId: string) => {
  const result = await prisma.rentalOrder.findFirst({
    where: {
      id,
      customerId,
    },
    include: {
      gearItem: true,
    },
  });

  if (!result) {
    throw new Error("Rental order not found");
  }

  return result;
};

const getProviderOrdersFromDB = async (providerId: string) => {
  const result = await prisma.rentalOrder.findMany({
    where: {
      gearItem: {
        providerId,
      },
    },
    include: {
      gearItem: true,
      customer: true,
    },
    orderBy: {
      rentalDate: "desc",
    },
  });
  if (!result) {
    throw new Error("Rental order not found");
  }

  return result;
};

const updateRentalOrderStatusIntoDB = async (
  orderId: string,
  providerId: string,
  status: RentalStatus,
) => {
  const order = await prisma.rentalOrder.findUnique({
    where: {
      id: orderId,
    },
    include: {
      gearItem: true,
    },
  });

  if (!order) {
    throw new Error("Rental order not found");
  }

  if (order.gearItem.providerId !== providerId) {
    throw new Error("You are not authorized to update this order");
  }

  const result = await prisma.rentalOrder.update({
    where: {
      id: orderId,
    },
    data: {
      status,
    },
  });

  return result;
};

const getAllRentalOrdersByAdminIntoDB = async () => {
  const result = await prisma.rentalOrder.findMany({
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true,
          address: true,
          profilePhoto: true,
        },
      },
      gearItem: {
        include: {
          provider: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              status: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};

export const rentalOrderService = {
  createRentalIntoDB,
  allGetMyRentalOrdersFromDB,
  getSingleRentalOrderFromDB,
  getProviderOrdersFromDB,
  updateRentalOrderStatusIntoDB,
  getAllRentalOrdersByAdminIntoDB,
};
