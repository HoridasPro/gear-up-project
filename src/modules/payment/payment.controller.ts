import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { paymentService } from "./payment.service";
import httpStatus from "http-status";

const createCheckoutSession = catchAsync(
  async (req: Request, res: Response) => {
    const customerId = req.data!.id;

    const result = await paymentService.createCheckoutSessionIntoDB(
      customerId,
      req.body.rentalOrderId,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Checkout session created successfully",
      data: result,
    });
  },
);

export const paymentController = {
  createCheckoutSession,
};
