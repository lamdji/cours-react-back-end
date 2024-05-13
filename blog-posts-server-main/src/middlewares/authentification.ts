import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { verifyToken } from "../libs/token/token";

export type AuthenticatedBody = {
  decodedToken: {
    id: string;
  };
};
export const verifyAuthToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const tokenHeader = req.headers.authorization;
  if (!tokenHeader) {
    return res.status(StatusCodes.FORBIDDEN).json({
      success: false,
      data: { error: "Invalid creadentials", errors: [] },
    });
  }

  const token = await verifyToken<{ id: string }>(
    tokenHeader.split(" ")[1]
  );

  if (!token.success || !token.data) {
    return res.status(StatusCodes.FORBIDDEN).json({
      success: false,
      data: { error: "Invalid creadentials", errors: [] },
    });
  }
  req.body.token = tokenHeader.split(" ")[1];
  req.body.decodedToken = token.data;
  next();
};
