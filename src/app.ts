import express from "express";
import config from "config";
import connectDB from "./utils/connect.utils";
import log from "./utils/logger.utils";
import routes from "./routes";

const PORT = config.get<number>("port");

const app = express();

routes(app);

app.listen(PORT, async () => {
  log.info(`[express] App is running on Port http://localhost:${PORT}`);

  await connectDB();
});
