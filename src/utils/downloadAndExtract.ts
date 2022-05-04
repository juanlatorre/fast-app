import StreamZip from "node-stream-zip";
import fs from "fs-extra";
import needle from "needle";

export function downloadAndExtractRepo(path: string, template: string) {
  const file = `${path}/master.zip`;
  return needle
    .get(
      "https://codeload.github.com/juanlatorre/create-tactech-app/zip/master",
    )
    .pipe(fs.createWriteStream(file))
    .on("done", async () => {
      const zip = new StreamZip.async({ file });
      await zip.extract(
        `create-tactech-app-master/templates/${template}`,
        `./${path}`,
      );
      await zip.close();
      await fs.remove(file);
    });
}
