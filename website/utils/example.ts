import packageJson from "../../package.json";

const maumboVersion = packageJson["version"].replace(/^[^\d]*/, "");
const hisabatiVersion = packageJson.dependencies["hisabati"].replace(/^[^\d]*/, "");
const marangiVersion = packageJson.devDependencies["marangi"].replace(/^[^\d]*/, "");
const datGuiVersion = packageJson.devDependencies["dat.gui"].replace(/^[^\d]*/, "");

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
  const maumboUrl = isProd
    ? `https://cdn.jsdelivr.net/npm/maumbo@${maumboVersion}/dist/index.module.js`
    : "/src/index.ts";
  const datGuiUrl = isProd
    ? `https://cdn.jsdelivr.net/npm/dat.gui@${datGuiVersion}/build/dat.gui.module.js`
    : "/node_modules/dat.gui/build/dat.gui.module.js";

  return {
    imports: {
      marangi: marangiUrl,
      maumbo: maumboUrl,
      hisabati: hisabatiUrl,
      "dat.gui": datGuiUrl,
    },
  };
}

export function getExampleImportMap(isProd: boolean): string {
  return JSON.stringify(createExampleImportMap(isProd));
}
