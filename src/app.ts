import * as pack from "../package.json";

import boxen from "boxen";
import chalk from "chalk";
import checkForUpdate from "update-check";
import fs from "fs";
import inquirer from "inquirer";
import { install } from "./utils";
import validatePkg from "validate-npm-package-name";

interface FirstSet {
  package_name: string;
  area: "frontend" | "backend" | "mobile";
}

interface TS {
  use_ts: boolean;
}

interface FrontendFrameworks {
  frontend_framework: "react" | "vue.js" | "angular";
}

interface ReactFrameworks extends TS {
  react_framework: "next.js" | "remix" | "cra";
}

interface SecondSet {
  language: "node.js" | "golang";
  transport: "graphql" | "rest" | "grpc";
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
  const update = await checkForUpdate(pack);

  if (update) {
    console.log(
      chalk.yellow(
        boxen(
          `The latest version is ${update.latest}. Please run\n$ npm install -g fast-app@latest`,
          {
            padding: 1,
            textAlignment: "center",
          },
        ),
      ),
    );
  }

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
        "Backend",
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
                value: "remix",
              },
              {
                name: "Create React App",
                value: "cra",
              },
            ],
            filter,
          },
          {
            type: "confirm",
            name: "use_ts",
            message: "Do you want to use TypeScript?:",
          },
        ]);

      try {
        fs.mkdirSync(firstSet.package_name);

        if (react_framework === "next.js" && use_ts) {
          await install(firstSet.package_name, "next-ts");
        } else if (react_framework === "next.js" && !use_ts) {
          await install(firstSet.package_name, "next");
        } else if (react_framework === "remix" && use_ts) {
          await install(firstSet.package_name, "remix-ts");
        } else if (react_framework === "remix" && !use_ts) {
          await install(firstSet.package_name, "remix");
        } else if (react_framework === "cra" && use_ts) {
          await install(firstSet.package_name, "cra-ts");
        } else if (react_framework === "cra" && !use_ts) {
          await install(firstSet.package_name, "cra");
        }
      } catch (err) {
        console.error(err);
      }
    }
  } else if (firstSet.area === "backend") {
    const { language, transport }: SecondSet = await inquirer.prompt([
      {
        type: "list",
        name: "language",
        message: "Choose a language:",
        choices: [
          {
            name: "Node.js (recommended)",
            value: "node.js",
          },
          {
            name: "Golang",
            value: "golang",
            disabled: "Not yet supported",
          },
        ],
        filter,
      },
      {
        type: "list",
        name: "transport",
        message: "Choose a HTTP Transport:",
        choices: [
          {
            name: "GraphQL",
            value: "graphql",
          },
          {
            name: "REST",
            value: "rest",
            disabled: "Not yet supported",
          },
          {
            name: "gRPC",
            value: "grpc",
            disabled: "Not yet supported",
          },
        ],
        filter,
      },
    ]);

    if (language === "node.js") {
      try {
        fs.mkdirSync(firstSet.package_name);

        if (transport === "graphql") {
          await install(firstSet.package_name, "node-graphql-ts");
        } else if (transport === "rest") {
          // not yet supported
          // await install(firstSet.package_name, "node-rest-ts");
        } else if (transport === "grpc") {
          // not yet supported
          // await install(firstSet.package_name, "node-grpc-ts");
        }
      } catch (err) {
        console.error(err);
      }
    } else if (language === "golang") {
      if (transport === "graphql") {
        // not yet supported
      } else if (transport === "rest") {
        // not yet supported
      } else if (transport === "grpc") {
        // not yet supported
      }
    }
  } else if (firstSet.area === "mobile") {
    // Pregunto, choose a framework
    // Flutter (Recommended)
    // React Native
    // Expo or CLI ?
  }

  console.log();
  console.log(
    boxen(
      `${chalk.magenta(
        firstSet.package_name,
      )} was successfully generated.\nThanks for using fast-app`,
      { padding: 1 },
    ),
  );
  console.log();
};
