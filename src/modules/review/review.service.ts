import { RentalStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { IReviewInteface } from "./review.interface";

const createReviewIntoDB = async (
  customerId: string,
  payload: IReviewInteface,
) => {
  const rental = await prisma.rentalOrder.findFirst({
    where: {
      id: payload.rentalOrderId,
      customerId,
      gearItemId: payload.gearItemId,
      status: RentalStatus.RETURNED,
    },
  });

  if (!rental) {
    throw new Error("You can review only your returned rental");
  }

  const existingReview = await prisma.review.findUnique({
    where: {
      rentalOrderId: payload.rentalOrderId,
    },
  });

  if (existingReview) {
    throw new Error("You have already reviewed this rental");
  }

  const review = await prisma.review.create({
    data: {
      rating: payload.rating,
      comment: payload.comment,
      customerId,
      gearItemId: payload.gearItemId,
      rentalOrderId: payload.rentalOrderId,
    },
  });

  return review;
};
const getAllReviewsFromDB = async () => {
  const reviews = await prisma.review.findMany({
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
          profilePhoto: true,
        },
      },
      gearItem: {
        select: {
          id: true,
          title: true,
          gearItemImage: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return reviews;
};
export const reviewService = {
  createReviewIntoDB,
  getAllReviewsFromDB,
};
