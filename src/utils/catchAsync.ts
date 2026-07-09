import { NextFunction, Request, Response } from "express";
import httpstatus from "http-status";

export const catchAsync = (fn: Function) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      res.status(httpstatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        statusCode: httpstatus.INTERNAL_SERVER_ERROR,
        message: "Failed to user register",
        error: (error as Error).message,
      });
    }
  };
};
