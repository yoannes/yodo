import { defineConfig } from "cypress";
import dotenv from "dotenv";

dotenv.config()

export default defineConfig({
  e2e: {
    viewportWidth: 1280,
    viewportHeight: 1024,
    setupNodeEvents(on, _config) {
      on("before:browser:launch", (browser = {}, launchOptions) => {
        if (browser.family === "chromium" && browser.name !== "electron") {
          // Add the language to Chrome options
          launchOptions.args.push("--lang=en-US"); // Change 'en-US' to your desired locale
        }

        return launchOptions;
      });
    },
    baseUrl: "http://localhost:8080",
  },
  env: {
    ...process.env,
  },
});
