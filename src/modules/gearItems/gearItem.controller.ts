import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { gearItemService } from "./gearItem.service";

const createGearItem = catchAsync(async (req: Request, res: Response) => {
  const providerId = req.data?.id as string;

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

const updateGearItem = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;

  const result = await gearItemService.updateGearItemIntoDB(
    id,
    req.body,
    req.data?.id as string,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Gear updated successfully",
    data: result,
  });
});

const deleteGearItem = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;

  const result = await gearItemService.deleteGearItemFromDB(
    id,
    req.data?.id as string,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Gear deleted successfully",
    data: result,
  });
});

const getAllGearItemForAdmin = catchAsync(
  async (req: Request, res: Response) => {
    const result = await gearItemService.getAllGearItemForAdminIntoDB();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All gear fetched successfully",
      data: result,
    });
  },
);

export const gearItemController = {
  createGearItem,
  getAllGearItem,
  getSingleGearItem,
  updateGearItem,
  deleteGearItem,
  getAllGearItemForAdmin,
};
