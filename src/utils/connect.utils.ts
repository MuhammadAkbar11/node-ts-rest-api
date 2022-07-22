import mongoose from "mongoose";
import config from "config";
import logger from "./logger.utils";

async function connectDB() {
  const dbUri = config.get<string>("dbUri");
  try {
    const conn = await mongoose.connect(dbUri);
    logger.info("[mongoose] Connected to DB");
    logger.info(
      `[mongoose] connected on 'mongodb://*****:*****@${conn.connection.host}:${conn.connection.port}' `
    );
    logger.info(`[mongoose] mongo database : ${conn.connection.name}`);
  } catch (error) {
    logger.info("could not connect to DB");
    logger.info(error);
    process.exit(1);
  }
}

export default connectDB;
