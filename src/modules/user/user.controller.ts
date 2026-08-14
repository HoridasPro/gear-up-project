import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { userServiceDB } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
// import { Request, Response } from "express";
// import { UserService } from "./user.service";

const createUser = catchAsync(async (req: Request, res: Response) => {
  const payload = {
    ...req.body,
    profilePhoto: req.file,
  };

  console.log("REGISTER BODY =", req.body);
  console.log("REGISTER FILE =", req.file);

  const user = await userServiceDB.createUserIntoDB(payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Register successfully",
    data: user,
  });
});

export default createUser;
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
  const search = String(req.query.search || "");
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  console.log("page now:", page);
  console.log("limit now:", limit);

  const result = await userServiceDB.getAllUsersFromDB(search, page, limit);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Users fetched successfully",

    data: result.users,

    pagination: {
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: result.totalPages,
    },
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

// src/app/modules/user/user.controller.ts

const updateMyProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.data?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        message: "Unauthorized user",
      });
    }

    const result = await userServiceDB.updateMyProfile(userId, req.body);

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Profile updated successfully",
      data: result,
    });
  } catch (error) {
    console.error("Update profile error:", error);

    return res.status(500).json({
      success: false,
      statusCode: 500,
      message:
        error instanceof Error ? error.message : "Failed to update profile",
    });
  }
};

export const userController = {
  createUser,
  getMyProfile,
  getAllUsers,
  updateUserStatus,
  updateMyProfile,
};
