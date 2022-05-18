import { execSync } from "child_process";

function isInGitRepository(name: string): boolean {
  try {
    execSync(`cd ${name} && git rev-parse --is-inside-work-tree`, {
      stdio: "ignore",
    });
    return true;
  } catch (_) {}
  return false;
}

export function tryGitInit(name: string): boolean {
  try {
    execSync(`git --version`, { stdio: "ignore" });

    if (isInGitRepository(name)) {
      return false;
    }

    execSync(`cd ${name} && git init`, { stdio: "ignore" });

    execSync(`cd ${name} && git checkout -b main`, { stdio: "ignore" });

    execSync(`cd ${name} && git add -A`, { stdio: "ignore" });
    execSync(`cd ${name} && git commit -m "Initial commit from Fast App"`, {
      stdio: "ignore",
    });
    return true;
  } catch (e) {
    return false;
  }
}
