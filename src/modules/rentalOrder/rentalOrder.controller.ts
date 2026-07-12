import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { rentalOrderService } from "./rentalOrder.service";
import httpStatus from "http-status";
import { RentalStatus } from "../../../generated/prisma/enums";

const createRentalOrder = catchAsync(async (req: Request, res: Response) => {
  const result = await rentalOrderService.createRentalIntoDB(
    req.body,
    req.data?.id as string,
  );
  console.log(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Rental created successfully",
    data: result,
  });
});

const allGetMyRentalOrders = catchAsync(async (req: Request, res: Response) => {
  const result = await rentalOrderService.allGetMyRentalOrdersFromDB(
    req.data?.id as string,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Rental orders fetched successfully",
    data: result,
  });
});

const getSingleRentalOrder = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;

  const result = await rentalOrderService.getSingleRentalOrderFromDB(
    id,
    req.data?.id as string,
  );
  console.log(result);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Rental order fetched successfully",
    data: result,
  });
});

const getProviderOrders = catchAsync(async (req: Request, res: Response) => {
  const result = await rentalOrderService.getProviderOrdersFromDB(
    req.data?.id as string,
  );
  console.log(result);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Provider orders fetched successfully",
    data: result,
  });
});

// const updateRentalOrderStatus = catchAsync(
//   async (req: Request, res: Response) => {
//     const result = await rentalOrderService.updateRentalOrderStatusIntoDB(
//       req.params.id as string,
//       req.data!.id,
//       req.body.status as RentalStatus,
//     );

//     sendResponse(res, {
//       success: true,
//       statusCode: httpStatus.OK,
//       message: "Rental order status updated successfully",
//       data: result,
//     });
//   },
// );
export const rentalOrderController = {
  createRentalOrder,
  allGetMyRentalOrders,
  getSingleRentalOrder,
  getProviderOrders,
  // updateRentalOrderStatus,
};
