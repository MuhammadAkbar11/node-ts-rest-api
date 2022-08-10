import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(__dirname, "../.env.test"),
});

const { PORT, PRIVATE_KEY, PUBLIC_KEY, DB_URI } = process.env;

export default {
  port: PORT,
  dbUri: DB_URI,
  saltWorkFactor: 10,
  accessTokenTtl: "15m",
  refreshTokenTtl: "7d",
  publicKey: PUBLIC_KEY,
  privateKey: PRIVATE_KEY,
};
