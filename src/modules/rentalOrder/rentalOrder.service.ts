import { RentalStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { IRentalOrder } from "./rentalOrder.interface";

const createRentalIntoDB = async (
  payload: IRentalOrder,
  customerId: string,
) => {
  const customer = await prisma.user.findUnique({
    where: {
      id: customerId,
    },
  });

  if (!customer) {
    throw new Error("Customer not found");
  }

  if (customer.status !== "ACTIVE") {
    throw new Error("Your account is suspended. You cannot place an order.");
  }

  const gearItem = await prisma.gearItem.findUnique({
    where: {
      id: payload.gearItemId,
    },
  });

  if (!gearItem) {
    throw new Error("Gear item not found");
  }

  if (payload.quantity <= 0) {
    throw new Error("Quantity must be greater than 0");
  }

  if (payload.quantity > gearItem.quantity) {
    throw new Error("Requested quantity exceeds total gear quantity");
  }

  const startDate = new Date(payload.startDate);
  const endDate = new Date(payload.endDate);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    throw new Error("Invalid rental date");
  }

  if (startDate >= endDate) {
    throw new Error("End date must be after start date");
  }

  const overlappingOrders = await prisma.rentalOrder.findMany({
    where: {
      gearItemId: payload.gearItemId,

      startDate: {
        lte: endDate,
      },

      endDate: {
        gte: startDate,
      },

      status: {
        not: "CANCELLED",
      },
    },

    select: {
      quantity: true,
    },
  });

  const bookedQuantity = overlappingOrders.reduce(
    (total, order) => total + order.quantity,
    0,
  );

  const availableQuantity = gearItem.quantity - bookedQuantity;

  if (availableQuantity < payload.quantity) {
    throw new Error(
      `Only ${availableQuantity} item(s) are available for the selected dates.`,
    );
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

    include: {
      customer: true,
      gearItem: true,
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
      payment: true,
    },
    orderBy: {
      rentalDate: "desc",
    },
  });

  if (!result) {
    throw new Error("Rental orders not found");
  }

  const rentalsWithReview = await Promise.all(
    result.map(async (rental) => {
      const review = await prisma.review.findFirst({
        where: {
          rentalOrderId: rental.id,
          customerId,
        },
      });

      return {
        ...rental,
        hasReview: !!review,
      };
    }),
  );

  return rentalsWithReview;
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

const cancelRentalOrderIntoDB = async (
  rentalOrderId: string,
  customerId: string,
) => {
  const rentalOrder = await prisma.rentalOrder.findFirst({
    where: {
      id: rentalOrderId,
      customerId,
    },
  });

  if (!rentalOrder) {
    throw new Error("Rental order not found");
  }

  if (rentalOrder.status !== "PLACED") {
    throw new Error("Only placed rental orders can be cancelled");
  }

  const result = await prisma.rentalOrder.update({
    where: {
      id: rentalOrderId,
    },
    data: {
      status: "CANCELLED",
    },
    include: {
      gearItem: true,
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
  cancelRentalOrderIntoDB,
};
