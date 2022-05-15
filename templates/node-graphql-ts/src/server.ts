console.time("Startup time");

import { ENV, HOST, PORT, logger } from "./env";

import Fastify from "fastify";
import { buildApp } from "./ez/app";
import fastifyCors from "@fastify/cors";
import { validateSchema } from "graphql";

export const EZApp = buildApp();

EZApp.getEnveloped.then((getEnveloped) => {
  const errors = validateSchema(getEnveloped().schema);

  if (errors.length > 1) {
    errors.forEach(console.error);
    process.exit(1);
  }
});

export const app = Fastify({
  logger,
  pluginTimeout: 1000 * 10,
});

app.register(EZApp.fastifyPlugin);

ENV.IS_DEVELOPMENT &&
  app.register(fastifyCors, {
    origin: "*",
  });

app.listen(PORT, HOST).then((address) => {
  console.log(`Listening on ${address.replace("0.0.0.0", "localhost")}`);
  console.timeEnd("Startup time");
});
