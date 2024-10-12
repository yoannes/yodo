import fs from "fs";
import path from "path";

// Script to generate dynamic files used in the app

const rootPath = process.cwd();
const iconsPath = path.resolve(rootPath, "./public/icons");
const componentPath = path.resolve(rootPath, "./src/components/YodoIcon");

function generateIconsList() {
  const list = fs.readdirSync(iconsPath);

  if (!list) {
    throw new Error("Icons folder is empty");
  }

  const res = [];

  for (const icon of list) {
    // skip non svg files
    if (path.extname(icon) !== ".svg") {
      continue;
    }

    const name = icon.replace(".svg", "");

    res.push(name);
  }

  const filePath = path.resolve(componentPath, "./types/iconType.ts");
  const comment =
    "/**\n * This is a generated file. Do not edit or your changes will be lost\n */\n\n";
  const type = `export type IconType = ${res.map((item) => `"${item}"`).join(" | ")};`;

  fs.writeFileSync(filePath, comment + type);

  // biome-ignore lint/suspicious/noConsoleLog: <explanation>
  console.log("Icons list generated", filePath);
}

generateIconsList();
