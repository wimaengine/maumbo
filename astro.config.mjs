import { defineConfig } from "astro/config";
import path from "node:path";
import remarkGfm from "remark-gfm";
import remarkGithubBlockquoteAlert from "remark-github-blockquote-alert";
import remarkLinkBase from "./website/plugins/remark-link-base.js";

export default defineConfig({
  output:'static',
  srcDir: "./website",
  publicDir: "./assets",
  outDir: "./dist/website",
  vite: {
    resolve: {
      alias: {
        "webgllis": path.resolve("./src"),
        // Allow Vite to bundle examples in dev without relying on an import map.
        "maumbo": path.resolve("./src/index.ts"),
        "@examples/utils": path.resolve("./website/vendor/canvas2d.js"),
        "@configs": path.resolve("./website/config"),
        "@layouts": path.resolve("./website/layouts"),
        "@components": path.resolve("./website/components"),
      }
    }
  },
  markdown: {
    remarkPlugins: [
      remarkGfm,
      remarkGithubBlockquoteAlert,
      remarkLinkBase,
    ],
  },
});
