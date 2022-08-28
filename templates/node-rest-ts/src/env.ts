import { dirname, resolve } from "path";

import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { requireEnv } from "require-env-variable";

dotenv.config({
  path: resolve(dirname(fileURLToPath(import.meta.url)), "../.env"),
});

export const { HOST = "http://0.0.0.0" } = requireEnv("HOST");
const { PORT: port } = requireEnv("PORT");
export const PORT = parseInt(port, 10) || 3000;

const NODE_ENV = process.env.NODE_ENV;

const IS_PRODUCTION = NODE_ENV === "production";

const IS_DEVELOPMENT = NODE_ENV === "development";

export const IS_CI = !!process.env.CI;

export const IS_NOT_CI = !IS_CI;

export const API_URL = `http://${HOST}:${PORT}/`;
export const HEALTH_URL = `http://${HOST}:${PORT}/health`;

export const ENV = {
  IS_DEVELOPMENT,
  IS_PRODUCTION,
};

console.log({
  NODE_ENV,
  ENV,
  API_URL,
  HEALTH_URL,
});
