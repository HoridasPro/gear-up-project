import { RentalStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { IReviewInteface } from "./review.interface";

const createReviewIntoDB = async (
  customerId: string,
  payload: IReviewInteface,
) => {
  const rental = await prisma.rentalOrder.findFirst({
    where: {
      customerId,
      gearItemId: payload.gearItemId,
      status: RentalStatus.RETURNED,
    },
  });
  console.log("Customer ID:", customerId);
  console.log("Gear Item ID:", payload.gearItemId);

  console.log(rental);

  if (!rental) {
    throw new Error("You can review only after returning the rented gear");
  }

  const review = await prisma.review.create({
    data: {
      customerId,
      gearItemId: payload.gearItemId,
      rating: payload.rating,
      comment: payload.comment,
    },
  });

  return review;
};

export const reviewService = {
  createReviewIntoDB,
};
