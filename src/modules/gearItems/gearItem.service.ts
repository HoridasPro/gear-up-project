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

export const gearItemService = {
  createGearIntoDB,
  getAllGearItemIntoDB,
};
