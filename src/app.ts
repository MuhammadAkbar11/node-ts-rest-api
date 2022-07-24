import express from "express";
import config from "config";
import connectDB from "./utils/connect.utils";
import log from "./utils/logger.utils";
import routes from "./routes";
import deserializeUser from "./middleware/deserializeUser";

const PORT = config.get<number>("port");

const app = express();

app.use(express.json());

app.use(deserializeUser);

routes(app);

app.listen(PORT, async () => {
  log.info(`[express] App is running on Port http://localhost:${PORT}`);

  await connectDB();
});
