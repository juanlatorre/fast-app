import { loadFiles } from "@graphql-tools/load-files";
import { makeExecutableSchema } from "@graphql-tools/schema";

export const schema = makeExecutableSchema({
  typeDefs: await loadFiles("./**/schema.graphql"),
  resolvers: await loadFiles("./**/{mutation,query,resolvers}/index.js"),
});
