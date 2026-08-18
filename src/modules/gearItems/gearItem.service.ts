import { prisma } from "../../lib/prisma";
import { IFilterGearItem, IInterfaceGearItem } from "./gearItem.interface";

const createGearIntoDB = async (
  providerId: string,
  payload: IInterfaceGearItem,
) => {
  const result = await prisma.gearItem.create({
    data: {
      title: payload.title,
      description: payload.description,
      category: payload.category,
      price: Number(payload.price),
      brand: payload.brand,
      quantity: Number(payload.quantity),
      gearItemImage: payload.gearItemImage,

      provider: {
        connect: {
          id: providerId,
        },
      },
    },
  });

  return result;
};

const getAllGearItemIntoDB = async (query: Partial<IFilterGearItem>) => {
  const { category, price, brand, search } = query;

  const where: any = {};

  if (search) {
    where.OR = [
      {
        title: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        description: {
          contains: search,
          mode: "insensitive",
        },
      },
    ];
  }

  if (category) {
    where.category = {
      equals: category,
      mode: "insensitive",
    };
  }

  if (brand) {
    where.brand = {
      equals: brand,
      mode: "insensitive",
    };
  }

  if (price) {
    where.price = Number(price);
  }

  const result = await prisma.gearItem.findMany({
    where,
    include: {
      provider: {
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
    },
  });

  return result;
};

const getSingleGearItemIntoDB = async (id: string) => {
  const result = await prisma.gearItem.findUnique({
    where: {
      id,
    },
    include: {
      provider: true,
    },
  });
  if (!result) {
    throw new Error("Gear not found in the database");
  }

  return result;
};

const updateGearItemIntoDB = async (
  id: string,
  payload: Partial<IInterfaceGearItem>,
  userId: string,
) => {
  const gearItem = await prisma.gearItem.findFirst({
    where: {
      id,
      providerId: userId,
    },
  });

  if (!gearItem) {
    throw new Error("Gear item not found");
  }

  return await prisma.gearItem.update({
    where: {
      id,
    },
    data: payload,
  });
};

const deleteGearItemFromDB = async (id: string, userId: string) => {
  const deleteGearItem = await prisma.gearItem.findFirst({
    where: {
      id,
      providerId: userId,
    },
  });

  if (!deleteGearItem) {
    throw new Error("Gear item not found");
  }

  const result = await prisma.gearItem.delete({
    where: {
      id,
    },
  });

  return result;
};

const getAllGearItemForAdminIntoDB = async () => {
  const result = await prisma.gearItem.findMany({
    include: {
      provider: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};
const getMyGearItemsIntoDB = async (
  providerId: string,
  query: Partial<IFilterGearItem>,
) => {
  const { category, price, brand, search } = query;

  const where: any = {
    providerId,
  };

  if (search) {
    where.OR = [
      {
        title: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        description: {
          contains: search,
          mode: "insensitive",
        },
      },
    ];
  }

  if (category) {
    where.category = {
      equals: category,
      mode: "insensitive",
    };
  }

  if (brand) {
    where.brand = {
      equals: brand,
      mode: "insensitive",
    };
  }

  if (price) {
    where.price = Number(price);
  }

  return await prisma.gearItem.findMany({
    where,
    include: {
      provider: {
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
    },
  });
};

const checkGearAvailability = async (
  gearItemId: string,
  startDate: string,
  endDate: string,
  quantity: number,
) => {
  const gearItem = await prisma.gearItem.findUnique({
    where: {
      id: gearItemId,
    },
  });

  if (!gearItem) {
    throw new Error("Gear item not found");
  }

  if (quantity <= 0) {
    throw new Error("Quantity must be greater than 0");
  }

  if (quantity > gearItem.quantity) {
    return {
      available: false,
      availableQuantity: gearItem.quantity,
    };
  }

  const rentalStartDate = new Date(startDate);
  const rentalEndDate = new Date(endDate);

  if (isNaN(rentalStartDate.getTime()) || isNaN(rentalEndDate.getTime())) {
    throw new Error("Invalid rental date");
  }

  if (rentalStartDate >= rentalEndDate) {
    throw new Error("End date must be after start date");
  }

  const overlappingOrders = await prisma.rentalOrder.findMany({
    where: {
      gearItemId,

      startDate: {
        lte: rentalEndDate,
      },

      endDate: {
        gte: rentalStartDate,
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

  const available = availableQuantity >= quantity;

  return {
    available,
    availableQuantity: Math.max(availableQuantity, 0),
  };
};

export const gearItemService = {
  createGearIntoDB,
  getAllGearItemIntoDB,
  getSingleGearItemIntoDB,
  updateGearItemIntoDB,
  deleteGearItemFromDB,
  getAllGearItemForAdminIntoDB,
  getMyGearItemsIntoDB,
  checkGearAvailability,
};
