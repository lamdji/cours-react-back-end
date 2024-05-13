import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ZodError, z } from "zod";

export function validateData(schema: z.ZodObject<any, any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        console.log(error.errors);

        const errorMessages = error.errors.map((issue: any) => ({
          message: `${issue.path.join(".")} is ${issue.message}`,
          code: issue.code,
          path: issue.path,
        }));
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: "Invalid data", errors: errorMessages });
      } else {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ error: "Internal Server Error" });
      }
    }
  };
}
