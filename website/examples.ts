const exampleModules = import.meta.glob("../examples/**/*.js", {
  query: "?raw",
  import: "default"
});

export const exampleResolvers = Object.fromEntries(
  Object.entries(exampleModules).map(([filePath, load]) => {
    const id = filePath.replace("../examples/", "").replace(/\.js$/, "");
    return [id, load];
  })
) as Record<string, () => Promise<string>>;

export function resolveExample(id: string): (() => Promise<string>) | undefined {
  return exampleResolvers[id];
}
