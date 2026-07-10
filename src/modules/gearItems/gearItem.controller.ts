import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { gearItemService } from "./gearItem.service";

const createGearItem = catchAsync(async (req: Request, res: Response) => {
  const providerId = req.user?.id as string;

  const result = await gearItemService.createGearIntoDB(providerId, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Gear added successfully",
    data: result,
  });
});

const getAllGearItem = catchAsync(async (req: Request, res: Response) => {
  const result = await gearItemService.getAllGearItemIntoDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Gear fatched successfully",
    data: result,
  });
});

const getSingleGearItem = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await gearItemService.getSingleGearItemIntoDB(id as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Single gear fetched successfully",
    data: result,
  });
});

const getAllCategories = catchAsync(async (req: Request, res: Response) => {
  const result = await gearItemService.getAllCategoriesIntoDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Categories fetched successfully",
    data: result,
  });
});

export const gearItemController = {
  createGearItem,
  getAllGearItem,
  getSingleGearItem,
  getAllCategories,
};
