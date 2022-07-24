import mongoose from "mongoose";
import { get } from "lodash";
import config from "config";
import SessionModel, { SessionDocument } from "../models/session.model";
import logger from "../utils/logger.utils";
import { signJwt, verifyJwt } from "../utils/jwt.utils";
import { findUserService } from "./user.service";

export async function createSessionService(userId: string, userAgent: string) {
  try {
    const result = await SessionModel.create({
      user: userId,
      userAgent: userAgent,
    });
    return result.toJSON();
  } catch (error: any) {
    logger.error(error);
    throw new Error(error);
  }
}

export async function findUserSession(
  query: mongoose.FilterQuery<SessionDocument>
) {
  try {
    return await SessionModel.find(query).lean();
  } catch (error: any) {
    logger.error(error);
    return false;
  }
}

export async function findOneUserSession(
  query: mongoose.FilterQuery<SessionDocument>
) {
  try {
    return await SessionModel.findOne(query).lean();
  } catch (error: any) {
    logger.error(error);
    return false;
  }
}

export async function updateSessionService(
  query: mongoose.FilterQuery<SessionDocument>,
  update: mongoose.UpdateQuery<SessionDocument>
) {
  try {
    return await SessionModel.updateOne(query, update);
  } catch (error) {
    return false;
  }
}

export async function reIssueAccessToken({
  refreshToken,
}: {
  refreshToken: string;
}) {
  const { decoded } = verifyJwt(refreshToken);

  if (!decoded || !get(decoded, "session")) return false;

  const session = await SessionModel.findById(get(decoded, "session"));

  if (!session || !session.valid) return false;

  const user = await findUserService({ _id: session.user });

  if (!user) return false;

  const accessToken = signJwt(
    {
      ...user,
      session: session._id,
    },
    { expiresIn: config.get("accessTokenTtl") } // 15m
  );

  return accessToken;
}
