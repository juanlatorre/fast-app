import { FastifyPluginCallback } from "fastify";
import { prisma } from "../prisma";

interface CreateInput {
  name: string;
  lastName: string;
  email: string;
}

export const users: FastifyPluginCallback = (fastify, _opts, next) => {
  fastify.get("/users", async (_request, reply) => {
    const users = await prisma.user.findMany({});
    reply.send(users);
  });

  fastify.post("/users/new", async (request, reply) => {
    const { email, lastName, name } = request.body as CreateInput;

    if (!email || !lastName || !name) {
      reply.status(400).send("The fields 'email', 'lastName' and 'name' are required.");
    }

    const user = await prisma.user.create({
      data: {
        email,
        lastName,
        name,
      },
    });

    if (!user) {
      reply.status(500).send("User could not be created, please try again.");
    }

    reply.send(user);
  });

  next();
};
