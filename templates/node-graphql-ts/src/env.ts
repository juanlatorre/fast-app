import { dirname, resolve } from "path";

import dotenv from "dotenv";
import { fileURLToPath } from "url";
import pino from "pino";
import { requireEnv } from "require-env-variable";

dotenv.config({
  path: resolve(dirname(fileURLToPath(import.meta.url)), "../.env"),
});

const { DISABLE_INTROSPECTION } = requireEnv("DISABLE_INTROSPECTION");

export const { PORT = 3010, HOST = "http://localhost" } = requireEnv(
  "PORT",
  "HOST",
);

const NODE_ENV = process.env.NODE_ENV;

const IS_PRODUCTION = NODE_ENV === "production";

const IS_DEVELOPMENT = NODE_ENV === "development";

export const IS_CI = !!process.env.CI;

export const IS_NOT_CI = !IS_CI;

export const logger = pino({
  level: IS_DEVELOPMENT ? "warn" : "info",
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      levelFirst: true,
      translateTime: true,
    },
  },
});

export const API_URL = `${HOST}:${PORT}/graphql`;

export const ENV = {
  IS_DEVELOPMENT,
  IS_PRODUCTION,
  DISABLE_INTROSPECTION,
};

console.log({
  NODE_ENV,
  ENV,
  API_URL,
});
