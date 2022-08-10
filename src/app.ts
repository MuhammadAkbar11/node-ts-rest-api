import express from "express";
import config from "config";
import connectDB from "./utils/connect.utils";
import log from "./utils/logger.utils";
import routes from "./routes";
import deserializeUser from "./middleware/deserializeUser";
import createServer from "./utils/server.utils";

const PORT = config.get<number>("port");

const app = createServer();

app.listen(PORT, async () => {
  log.info(`[express] App is running on Port http://localhost:${PORT}`);

  await connectDB();
});
