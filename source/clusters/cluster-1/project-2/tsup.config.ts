import { defineConfig } from "tsup";
export default defineConfig({ entry: ["scripts/launch.ts"], splitting: false, format: ["cjs"], clean: false, outDir: "dist" });