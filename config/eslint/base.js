import js from "@eslint/js";
import tseslint from "typescript-eslint";
import turboPlugin from "eslint-plugin-turbo";
import onlyWarn from "eslint-plugin-only-warn";
import eslintConfigPrettier from "eslint-config-prettier";
export const config = [
    eslintConfigPrettier,
    js.configs.recommended,
    { ignores: ["dist/**"] },
    { plugins: { onlyWarn } },
    ...tseslint.configs.recommended,
    { plugins: { turbo: turboPlugin }, rules: { "turbo/no-undeclared-env-vars": "warn" } },
];
