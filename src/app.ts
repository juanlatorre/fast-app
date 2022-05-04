import chalk from "chalk";
import { downloadAndExtractRepo } from "./utils";
import fs from "fs";
import inquirer from "inquirer";
import retry from "async-retry";
import validatePkg from "validate-npm-package-name";

interface FirstSet {
  package_name: string;
  area: "frontend" | "backend" | "mobile";
}

interface FrontendFrameworks {
  frontend_framework: "react" | "vue.js" | "angular";
}

interface ReactFrameworks {
  react_framework: "next.js" | "remix" | "cra";
  use_ts: boolean;
}

const filter = (val: string) => {
  return val.toLowerCase().replace(/\s+/g, "-");
};

const validate = (text: string) => {
  const { validForNewPackages } = validatePkg(text);

  if (!validForNewPackages) {
    return chalk.red("Please enter a valid package name.");
  }

  if (fs.existsSync(`./${text}`)) {
    return chalk.red("Directory already exists.");
  }

  return true;
};

export const app = async () => {
  const firstSet: FirstSet = await inquirer.prompt([
    {
      type: "input",
      name: "package_name",
      message: "Write the package name:",
      filter,
      validate,
    },
    {
      type: "list",
      name: "area",
      message: "Choose an area:",
      choices: [
        "Frontend",
        { name: "Backend", disabled: "Not supported yet" },
        { name: "Mobile", disabled: "Not supported yet" },
      ],
      filter,
    },
  ]);

  if (firstSet.area === "frontend") {
    const { frontend_framework }: FrontendFrameworks = await inquirer.prompt([
      {
        type: "list",
        name: "frontend_framework",
        message: "Choose a framework:",
        choices: [
          {
            name: "React (recommended)",
            value: "react",
          },
          {
            name: "Vue.js",
            disabled: "Not yet supported",
            value: "vue.js",
          },
          {
            name: "Angular",
            disabled: "Not yet supported",
            value: "angular",
          },
        ],
        filter,
      },
    ]);

    if (frontend_framework === "react") {
      const { use_ts, react_framework }: ReactFrameworks =
        await inquirer.prompt([
          {
            type: "confirm",
            name: "use_ts",
            message: "Do you want to use TypeScript?:",
          },
          {
            type: "list",
            name: "react_framework",
            message: "Choose a react framework:",
            choices: [
              {
                name: "Next.js (recommended)",
                value: "next.js",
              },
              {
                name: "Remix (recommended)",
                disabled: "Not yet supported",
                value: "remix",
              },
              {
                name: "Create React App",
                disabled: "Not yet supported",
                value: "cra",
              },
            ],
            filter,
          },
        ]);

      try {
        fs.mkdirSync(firstSet.package_name);

        if (react_framework === "next.js" && use_ts) {
          // Download Next.js + Typescript
          await retry(() => downloadAndExtractRepo(firstSet.package_name), {
            retries: 3,
          });
        } else if (react_framework === "next.js" && !use_ts) {
          // Download Next.js Vanilla JS
        } else if (react_framework === "remix" && use_ts) {
          // Download Remix + TypeScript
        } else if (react_framework === "remix" && !use_ts) {
          // Download Remix Vanilla JS
        } else if (react_framework === "cra" && use_ts) {
          // Download Create React App + TypeScript
        } else if (react_framework === "cra" && !use_ts) {
          // Download Create React App Vanilla JS
        }
      } catch (err) {
        console.error(err);
      }
    }
  } else if (firstSet.area === "backend") {
    // Pregunto, elige una api
    // GraphQL (Recommended)
    // REST (Recommended)
    // gRPC
  } else if (firstSet.area === "mobile") {
    // Pregunto, choose a framework
    // Flutter (Recommended)
    // React Native CLI
    // React Native Expo
  }
};
