import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { userServiceDB } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;

    const user = await userServiceDB.createUserIntoDB(payload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Register successfully",
      data: user,
    });
  },
);
const getMyProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userProfile = await userServiceDB.getMyProfileIntoDB(
      req.data?.id as string,
    );
    console.log(userProfile);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Profile retrieved successfully",
      data: userProfile,
    });
  },
);

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await userServiceDB.getAllUsersFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Users fetched successfully",
    data: result,
  });
});

const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;

  const result = await userServiceDB.updateUserStatusIntoDB(id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User status updated successfully",
    data: result,
  });
});

export const userController = {
  createUser,
  getMyProfile,
  getAllUsers,
  updateUserStatus,
};
