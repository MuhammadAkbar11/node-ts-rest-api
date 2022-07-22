import { DocumentDefinition } from "mongoose";
import UserModel, { UserDocument } from "../models/user.model";
import logger from "../utils/logger.utils";

export async function createUserService(
  input: DocumentDefinition<
    Omit<UserDocument, "createdAt" | "updatedAt" | "comparePassword">
  >
) {
  try {
    return await UserModel.create(input);
  } catch (error: any) {
    logger.error(error);
    throw new Error(error);
  }
}
