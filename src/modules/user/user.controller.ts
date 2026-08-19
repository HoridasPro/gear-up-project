import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { userServiceDB } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const createUser = catchAsync(async (req: Request, res: Response) => {
  const payload = {
    ...req.body,
    profilePhoto: req.file,
  };

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
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message:
        error instanceof Error ? error.message : "Failed to update profile",
    });
  }
};

const updateUserRole = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { role } = req.body;

  const result = await userServiceDB.updateUserRoleIntoDB(id as string, role);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User role updated successfully",
    data: result,
  });
});

const deleteMyAccount = async (req: Request, res: Response) => {
  try {
    const userId = req.data?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    await userServiceDB.deleteMyAccountIntoDB(userId);

    res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to delete account",
    });
  }
};

export const userController = {
  createUser,
  getMyProfile,
  getAllUsers,
  updateUserStatus,
  updateMyProfile,
  updateUserRole,
  deleteMyAccount,
};
