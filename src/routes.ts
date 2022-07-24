import { Application, Request, Response } from "express";
import {
  createUserSessionHandler,
  deleteSessionHandler,
  getUserSessionHandler,
} from "./controller/session.controller";
import { createUserHandler } from "./controller/user.controller";
import requiredUser from "./middleware/requiredUser";
import validateResource from "./middleware/validateResource";
import { createUserSessionSchema } from "./schema/session.schema";
import { createUserSchema } from "./schema/user.schema";

function routes(app: Application) {
  app.get("/healthcheck", (req: Request, res: Response) => {
    return res.sendStatus(200);
  });

  // users
  app.post("/api/users", validateResource(createUserSchema), createUserHandler);

  // session
  app.post(
    "/api/sessions",
    validateResource(createUserSessionSchema),
    createUserSessionHandler
  );
  app.get("/api/sessions", requiredUser, getUserSessionHandler);
  app.delete("/api/sessions", requiredUser, deleteSessionHandler);
}

export default routes;
