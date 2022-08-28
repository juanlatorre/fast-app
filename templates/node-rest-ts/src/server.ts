import { HOST, PORT } from "./env";
import { health, users } from "./services";

import fastify from "fastify";

export const app = fastify();

// Routes
app.register(users);
app.register(health);

app
  .listen({ port: PORT, host: HOST })
  .then(() => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
  })
  .catch((err) => {
    app.log.error(err);
    process.exit(1);
  });
