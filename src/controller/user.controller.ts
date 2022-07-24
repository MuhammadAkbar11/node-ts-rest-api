import { Request, Response } from "express";
import { omit } from "lodash";
import { CreateUserInput } from "../schema/user.schema";
import { createUserService } from "../services/user.service";
import logger from "../utils/logger.utils";

export async function createUserHandler(
  req: Request<{}, {}, CreateUserInput["body"]>,
  res: Response
) {
  try {
    const user = await createUserService(req.body);

    return res.status(201).json({
      message: "Registration successfully",
      user: user,
    });
  } catch (error: any) {
    logger.error(error);
    return res.status(409).json({
      message: error.message,
    });
  }
}
