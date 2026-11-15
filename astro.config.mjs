import { defineConfig } from "astro/config";
import { website } from "wima-docs-website-template";

export default defineConfig({
  output: "static",
  publicDir: "./assets",
  outDir: "./dist/website",
  integrations: [
    website({
      guideContentDir: "content/guide",
      examplesContentDir: "examples",
      apiSourceDir: "src",
      introContentPath: "README.md"
    })
  ]
});
