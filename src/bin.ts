import * as pack from "../package.json";

import { app } from "./app";
import { program } from "commander";

const VERSION = process.env.npm_package_version;

program
  .name(pack.name)
  .description(pack.description)
  .version(VERSION || pack.version);

program
  .parseAsync(process.argv)
  .then(app)
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
