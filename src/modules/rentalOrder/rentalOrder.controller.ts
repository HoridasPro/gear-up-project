import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { rentalOrderService } from "./rentalOrder.service";
import httpStatus from "http-status";

const createRentalOrder = catchAsync(async (req: Request, res: Response) => {
  const result = await rentalOrderService.createRentalIntoDB(
    req.body,
    req.data?.id as string,
  );
  console.log(result);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Rental created successfully",
    data: result,
  });
});

const allGetMyRentalOrders = catchAsync(async (req: Request, res: Response) => {
  const result = await rentalOrderService.getMyRentalOrdersFromDB(
    req.data?.id as string,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Rental orders fetched successfully",
    data: result,
  });
});

export const rentalOrderController = {
  createRentalOrder,
  allGetMyRentalOrders,
};
