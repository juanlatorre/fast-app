import * as typescript from "@graphql-codegen/typescript";
import * as typescriptResolvers from "@graphql-codegen/typescript-resolvers";

import { codegen } from "@graphql-codegen/core";
import { getCachedDocumentNodeFromSchema } from "@graphql-codegen/plugin-helpers";
import { promises } from "fs";
import { schema } from "./modules";

export default async function () {
  const config: typescript.TypeScriptPluginConfig &
    typescriptResolvers.TypeScriptResolversPluginConfig = {
    enumsAsTypes: true,
    contextType: "./context#GraphQLContext",
    scalars: {
      DateTime: "string | Date",
      EmailAddress: "string",
    },
  };

  const schemaAsDocumentNode = getCachedDocumentNodeFromSchema(schema);

  const codegenCode = await codegen({
    schema: schemaAsDocumentNode,
    schemaAst: schema,
    config,
    documents: [],
    filename: "types.generated.ts",
    pluginMap: {
      typescript,
      typescriptResolvers,
    },
    plugins: [
      {
        typescript: {},
      },
      {
        typescriptResolvers: {},
      },
    ],
  });

  await promises.writeFile("src/types.generated.ts", codegenCode, {
    encoding: "utf-8",
  });
}
