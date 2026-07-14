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

const confirmPayment = catchAsync(async (req: Request, res: Response) => {
  const result = await paymentService.confirmPaymentIntoDB(req.body.sessionId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payment confirmed successfully",
    data: result,
  });
});

const getMyPayments = catchAsync(async (req: Request, res: Response) => {
  const customerId = req.data!.id;

  const result = await paymentService.getMyPaymentsFromDB(customerId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payment history fetched successfully",
    data: result,
  });
});

export const paymentController = {
  createCheckoutSession,
  confirmPayment,
  getMyPayments,
};
