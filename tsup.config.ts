import { defineConfig } from "tsup"

export default defineConfig((options) => {
  return {
    entry: ["src/index.ts"],
    format: ["esm", "cjs"],
    splitting: false,
    sourcemap: options.sourcemap,
    clean: true,
    dts: true,
    legacyOutput: true,
  }
})
