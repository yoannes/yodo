import fs from "fs";
import { glob } from "glob";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

// Define __dirname for ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
  // Load translations from words.json
  const wordsPath = path.join(__dirname, "../../", "src/hooks/I18n/words.json");
  const translations = await import(wordsPath);
  const translationKeys = Object.keys(translations);

  // Get all .tsx files in the project
  const files = await glob("**/*.tsx", { ignore: "node_modules/**" });

  // Read all .tsx files and gather used translation keys
  let usedKeys = new Set<string>();
  const translationRegex = /t\(['"](\w+)['"]/g;

  files.forEach((file) => {
    const content = fs.readFileSync(file, "utf-8");
    let match;
    while ((match = translationRegex.exec(content)) !== null) {
      usedKeys.add(match[1]);
    }
  });

  // Find unused translation keys
  const unusedKeys = translationKeys.filter((key) => !usedKeys.has(key));

  if (unusedKeys.length > 0) {
    // biome-ignore lint/suspicious/noConsoleLog: <explanation>
    console.log("Unused translation keys:");
    // biome-ignore lint/suspicious/noConsoleLog: <explanation>
    unusedKeys.forEach((key) => console.log(`- ${key}`));
  } else {
    // biome-ignore lint/suspicious/noConsoleLog: <explanation>
    console.log("All translation keys are used!");
  }
}

main();
