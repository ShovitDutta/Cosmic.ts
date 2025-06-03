import { defineConfig } from "tsup";
export default defineConfig({
    entry: ["scripts/launch.ts"],
    outDir: "scripts",
    splitting: false,
    format: ["cjs"],
    clean: false,
});
