import { downloadAndExtractRepo } from "./downloadAndExtract";
import retry from "async-retry";
import { tryGitInit } from "./git";

export async function install(name: string, template: string) {
  await retry(() => downloadAndExtractRepo(name, template), {
    retries: 3,
  });

  tryGitInit(name);
}
