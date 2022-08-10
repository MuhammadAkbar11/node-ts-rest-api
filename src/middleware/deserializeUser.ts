import { get } from "lodash";
import { RequestHandler } from "express";
import { verifyJwt } from "../utils/jwt.utils";
import logger from "../utils/logger.utils";
import { reIssueAccessToken } from "../services/session.service";

const deserializeUser: RequestHandler = async (req, res, next) => {
  try {
    const accessToken = get(req, "headers.authorization", "").replace(
      /^Bearer\s/,
      ""
    );

    const refreshToken = get(req, "headers.x-refresh");

    if (!accessToken) {
      return next();
    }

    const { decoded, expired } = verifyJwt(accessToken);
    if (decoded) {
      res.locals.user = decoded;
      return next();
    }

    if (expired && refreshToken) {
      const newAccessToken = await reIssueAccessToken({ refreshToken });

      if (newAccessToken) {
        res.setHeader("x-access-token", newAccessToken);
      }
      logger.info("Create new access token");
      const result = verifyJwt(newAccessToken || "");

      res.locals.user = result!.decoded;
      return next();
    }

    return next();
  } catch (error) {
    logger.error(error);
    next();
  }
};
export default deserializeUser;
