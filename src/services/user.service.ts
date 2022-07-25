import mongoose from "mongoose";
import { omit } from "lodash";
import UserModel, { IUserInput, UserDocument } from "../models/user.model";
import logger from "../utils/logger.utils";

export async function createUserService(input: IUserInput) {
  try {
    const result = await UserModel.create(input);
    return omit(result.toJSON(), "password");
  } catch (error: any) {
    logger.error(error);
    throw new Error(error);
  }
}

export async function validatePassword({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return false;
    }

    const isValid = await user.comparePassword(password);

    if (!isValid) return false;

    return omit(user.toJSON(), "password");
  } catch (error) {
    logger.error(error);
    return false;
  }
}

export async function findUserService(
  query: mongoose.FilterQuery<UserDocument>
) {
  return await UserModel.findOne(query).lean();
}
