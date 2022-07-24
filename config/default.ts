import dotenv from "dotenv";

dotenv.config();

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
