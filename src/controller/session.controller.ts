import { Request, Response } from "express";
import config from "config";
import {
  createSessionService,
  findOneUserSession,
  findUserSession,
  updateSessionService,
} from "../services/session.service";
import { validatePassword } from "../services/user.service";
import { signJwt } from "../utils/jwt.utils";
import logger from "../utils/logger.utils";

interface ISession {
  _id: string;
}

export async function createUserSessionHandler(req: Request, res: Response) {
  try {
    // Validate the user's pw
    const user = await validatePassword(req.body);

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or Password",
      });
    }

    const existSession = await findUserSession({
      user: user._id,
      userAgent: req.get("user-agent"),
    });

    let session = null;

    if (existSession && existSession.length !== 0) {
      await updateSessionService({ _id: existSession[0]._id }, { valid: true });
      logger.info("Session is found");
      session = await findOneUserSession({ _id: existSession[0]._id });
    } else {
      logger.info("No found session and created new session ");
      session = await createSessionService(
        user._id,
        req.get("user-agent") || ""
      );
    }
    // create an access token

    if (session) {
      const { _id: sessionId } = session as ISession;
      const accessToken = signJwt(
        {
          ...user,
          session: sessionId,
        },
        { expiresIn: config.get("accessTokenTtl") } // 15m
      );

      const refreshToken = signJwt(
        {
          ...user,
          session: sessionId,
        },
        { expiresIn: config.get("refreshTokenTtl") } // 15m
      );

      return res.status(200).json({ accessToken, refreshToken });
    }

    return res.status(400).json({
      message: "Failed to create session",
      accessToken: null,
      refreshToken: null,
    });
  } catch (error: any) {
    logger.error(error);
    return res.status(409).json({
      message: error.message,
    });
  }
}

export async function getUserSessionHandler(req: Request, res: Response) {
  try {
    if (!res.locals.user) {
      return res.status(404).json({
        message: "Failed to get user session",
      });
    }

    const userId = res.locals.user._id;

    const session = await findUserSession({ user: userId, valid: true });

    if (!session) {
      return res.status(401).json({
        message: "Session not found",
      });
    }

    return res.json({
      message: "Success to get user session",
      session,
    });
  } catch (error: any) {
    logger.error(error);
    return res.status(409).json({
      message: error.message,
    });
  }
}

export async function deleteSessionHandler(req: Request, res: Response) {
  const sessionId = res.locals.user.session;
  try {
    await updateSessionService({ _id: sessionId }, { valid: false });

    return res.send({
      message: "Logout Success",
      accessToken: null,
      refreshToken: null,
    });
  } catch (error: any) {
    logger.error(error);
    return res.status(409).json({
      message: error.message || "Failed to delete session",
    });
  }
}
