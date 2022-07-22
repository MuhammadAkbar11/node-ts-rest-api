import pino from "pino";
import dayjs from "dayjs";
import dayjsUTC from "./dayjsUTC";

// const logger = pino({
//   prettyPrint: true,
//   base: {
//     pid: false,
//   },
//
// });

const logger = pino({
  prettifier: true,

  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      ignore: "pid,hostname",
    },
  },
  timestamp: () => `,"time": "${dayjsUTC().format("")}"`,
});

export default logger;
