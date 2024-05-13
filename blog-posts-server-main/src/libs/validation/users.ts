import { ZodError, z } from "zod";
import { StatusCodes } from "http-status-codes";
import { NextFunction, Request, Response } from "express";
export const userRegistrationSchema = z.object({
  username: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
});

