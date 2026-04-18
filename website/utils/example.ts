import packageJson from "../../package.json";
import { withBase } from "./url";

const maumboVersion = packageJson["version"].replace(/^[^\d]*/, "");
const hisabatiVersion = packageJson.dependencies["hisabati"].replace(/^[^\d]*/, "");
const marangiVersion = packageJson.dependencies["marangi"].replace(/^[^\d]*/, "");

export interface ExampleImportMap {
  imports: Record<string, string>;
}

export function createExampleImportMap(isProd: boolean): ExampleImportMap {
  const hisabatiUrl = isProd
    ? `https://cdn.jsdelivr.net/npm/hisabati@${hisabatiVersion}/dist/index.module.js`
    : "/node_modules/hisabati/dist/index.module.js";
  const marangiUrl = isProd
    ? `https://cdn.jsdelivr.net/npm/marangi@${marangiVersion}/dist/index.module.js`
    : "/node_modules/marangi/dist/index.module.js";
  const canvas2dUrl = isProd
    ? withBase("/vendor/canvas2d.js")
    : withBase("/website/vendor/canvas2d.js");
  const maumboUrl = isProd
    ? `https://cdn.jsdelivr.net/npm/maumbo@${maumboVersion}/dist/index.module.js`
    : "/src/index.ts";

  return {
    imports: {
      marangi: marangiUrl,
      maumbo: maumboUrl,
      hisabati: hisabatiUrl,
      canvas2d: canvas2dUrl,
      "@examples/utils": canvas2dUrl,
    },
  };
}

export function getExampleImportMap(isProd: boolean): string {
  return JSON.stringify(createExampleImportMap(isProd));
}
