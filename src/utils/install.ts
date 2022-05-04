import chalk from "chalk";
import { downloadAndExtractRepo } from "./downloadAndExtract";
import retry from "async-retry";

export async function install(name: string, template: string) {
  await retry(() => downloadAndExtractRepo(name, template), {
    retries: 3,
  });
  console.log(
    chalk.greenBright(`Project ${chalk.magenta(name)} created succesfully.`),
  );
}
