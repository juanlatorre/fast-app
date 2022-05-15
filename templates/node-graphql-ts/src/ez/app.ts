import {
  BuildContextArgs,
  CreateApp,
  InferFunctionReturn,
  gql,
} from "@graphql-ez/fastify";
import { CodegenOptions, ezCodegen } from "@graphql-ez/plugin-codegen";
import { dirname, resolve } from "path";

import { ENV } from "../env";
import { ezAltairIDE } from "@graphql-ez/plugin-altair";
import { ezDataLoader } from "@graphql-ez/plugin-dataloader";
import { ezGraphQLModules } from "@graphql-ez/plugin-modules";
import { ezScalars } from "@graphql-ez/plugin-scalars";
import { ezVoyager } from "@graphql-ez/plugin-voyager";
import { fileURLToPath } from "url";
import { prisma } from "../prisma";

async function buildContext({}: BuildContextArgs) {
  return {
    prisma,
  };
}

declare module "@graphql-ez/fastify" {
  interface EZContext extends InferFunctionReturn<typeof buildContext> {}
}

const __dirname = dirname(fileURLToPath(import.meta.url));

export const codegenOptions: CodegenOptions = {
  config: {
    scalars: {
      DateTime: "string | Date",
      EmailAddress: "string",
      URL: "string",
      Void: "unknown",
    },
    deepPartialResolvers: true,
    enumsAsTypes: true,
    targetPath: "src/ez.generated.ts",
  },
  enableCodegen: !ENV.IS_PRODUCTION,
  outputSchema: resolve(__dirname, "../../schema.gql"),
};

export { gql };
export const { buildApp, registerDataLoader, registerModule } = CreateApp({
  path: "/graphql",
  buildContext,
  async prepare() {
    await import("./modules/index");
  },
  introspection: {
    disable: ENV.DISABLE_INTROSPECTION !== "false",
  },
  cache: true,
  ez: {
    plugins: [
      ezCodegen(codegenOptions),
      ezGraphQLModules(),
      ezDataLoader(),
      ezScalars({
        DateTime: 1,
        JSONObject: 1,
        EmailAddress: 1,
        Void: 1,
      }),
      ENV.DISABLE_INTROSPECTION !== "false"
        ? null
        : ezAltairIDE({
            baseURL: "/altair/",
            path: "/altair",
          }),
      ENV.DISABLE_INTROSPECTION !== "false"
        ? null
        : ezVoyager({
            path: "/voyager",
            displayOptions: {
              rootType: undefined,
              skipRelay: false,
              skipDeprecated: true,
              sortByAlphabet: true,
              showLeafFields: true,
              hideRoot: false,
            },
          }),
    ],
  },
});
