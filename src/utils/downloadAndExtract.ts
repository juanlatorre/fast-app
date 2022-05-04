import fs from "fs-extra";
import needle from "needle";

export function downloadAndExtractRepo(path: string) {
  console.log(path);
  return needle
    .get(
      "https://codeload.github.com/juanlatorre/create-tactech-app/tar.gz/master",
    )
    .pipe(fs.createWriteStream("logo.png"));

  // tar.extract(
  //   { cwd: path },
  //   [`${create-tactech-app}-${master}-${path}`],
  // ),
}
