import { GraphQLError, GraphQLScalarType, Kind } from "graphql";
import { gql, registerModule } from "../app";
import isURL, { IsURLOptions } from "validator/lib/isURL.js";

export const BaseModule = registerModule(
  gql`
    scalar URL
    type Query {
      ping: String!
    }
    type Mutation {
      ping: String!
    }
  `,
  {
    id: "BaseModule",
    resolvers: {
      Query: {
        ping: () => "pong",
      },
      Mutation: {
        ping: () => "pong",
      },
      URL: new GraphQLScalarType({
        name: "URL",
        description: "HTTPS URL",
        parseValue: toValidURL,
        serialize: toValidURL,
        parseLiteral(ast) {
          if (ast.kind === Kind.STRING) return toValidURL(ast.value);

          throw new GraphQLError(
            `Can only validate String-like values but got a: ${ast.kind}`,
          );
        },
      }),
    },
  },
);

function toValidURL(value: unknown) {
  if (typeof value === "string" && isURL(value, validURLOptions)) return value;

  throw Error("Invalid URL");
}

const validURLOptions: IsURLOptions = {
  require_tld: true,
  require_protocol: true,
  protocols: ["https"],
  require_valid_protocol: true,
  require_host: true,
  allow_underscores: true,
  disallow_auth: true,
};
