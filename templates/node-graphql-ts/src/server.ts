import { ENV, HOST, PORT, logger } from "./env";
import fastify, { FastifyReply, FastifyRequest } from "fastify";

import GraphQLVoyagerFastify from "graphql-voyager-fastify-plugin";
import codegen from "./codegen";
import context from "./context";
import { createServer } from "@graphql-yoga/node";
import { schema } from "./modules";
import { useDisableIntrospection } from "@envelop/disable-introspection";

const app = fastify({ logger });

const graphQLServer = createServer<{
  req: FastifyRequest;
  reply: FastifyReply;
}>({
  graphiql: true,
  cors: {
    ...(ENV.IS_DEVELOPMENT && { origin: "*" }),
  },
  context,
  logging: app.log,
  plugins: [
    useDisableIntrospection({
      disableIf: () => ENV.DISABLE_INTROSPECTION !== "false",
    }),
  ],
  maskedErrors: {
    handleParseErrors: true,
    handleValidationErrors: true,
  },
  schema,
});

app.route({
  url: "/graphql",
  method: ["GET", "POST", "OPTIONS"],
  handler: async (req, reply) => {
    const response = await graphQLServer.handleIncomingMessage(req, {
      req,
      reply,
    });
    for (const [name, value] of response.headers) {
      reply.header(name, value);
    }

    reply.status(response.status);
    reply.send(response.body);
  },
});

ENV.DISABLE_INTROSPECTION === "false" &&
  app.register(GraphQLVoyagerFastify, {
    path: "/voyager",
    displayOptions: {
      rootType: undefined,
      skipRelay: false,
      skipDeprecated: true,
      sortByAlphabet: true,
      showLeafFields: true,
      hideRoot: false,
    },
  });

app
  .listen({ port: PORT, host: HOST })
  .then(() => {
    ENV.IS_DEVELOPMENT && codegen();
  })
  .catch((err) => {
    app.log.error(err);
    process.exit(1);
  });
