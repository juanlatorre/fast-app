import { FastifyPluginCallback } from "fastify";

export const health: FastifyPluginCallback = (fastify, _opts, next) => {
  fastify.get("/health", async (_req, reply) => {
    reply.status(200);
    reply.send({ status: "available" });
  });

  next();
};
