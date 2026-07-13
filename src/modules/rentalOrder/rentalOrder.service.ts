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
  console.log(gearItem);

  if (!gearItem) {
    throw new Error("Gear item not found");
  }

  if (gearItem.quantity < payload.quantity) {
    throw new Error("Insufficient quantity");
  }

  const totalPrice = gearItem.price * payload.quantity;

  const rentalOrder = await prisma.rentalOrder.create({
    data: {
      gearItemId: payload.gearItemId,
      customerId,
      quantity: payload.quantity,
      totalPrice,
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
  console.log("get result", result);
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
