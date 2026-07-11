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
  const { category, price, brand } = query;

  const where: any = {};

  // Category Filter
  if (category) {
    where.category = {
      equals: category,
      mode: "insensitive",
    };
  }

  // Brand Filter
  if (brand) {
    where.brand = {
      equals: brand,
      mode: "insensitive",
    };
  }

  // Price Filter
  if (price) {
    where.price = Number(price);
  }

  const result = await prisma.gearItem.findMany({
    where,
    include: {
      provider: true,
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

export const gearItemService = {
  createGearIntoDB,
  getAllGearItemIntoDB,
  getSingleGearItemIntoDB,
  updateGearItemIntoDB,
  deleteGearItemFromDB,
};
