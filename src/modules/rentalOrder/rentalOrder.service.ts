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
      customer: true,
    },
    orderBy: {
      rentalDate: "desc",
    },
  });

  return result;
};

export const rentalOrderService = {
  createRentalIntoDB,
  getMyRentalOrdersFromDB: allGetMyRentalOrdersFromDB,
};
