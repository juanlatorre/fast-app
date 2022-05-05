import chalk from "chalk";
import { downloadAndExtractRepo } from "./downloadAndExtract";
import retry from "async-retry";
import { tryGitInit } from "./git";

export async function install(name: string, template: string) {
  await retry(() => downloadAndExtractRepo(name, template), {
    retries: 3,
  });

  tryGitInit(name);

  console.log(
    chalk.greenBright(`Project ${chalk.magenta(name)} created succesfully.`),
  );
}
