import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { config as baseConfig } from "./base.js";
import pluginNext from "@next/eslint-plugin-next";
import pluginReactHooks from "eslint-plugin-react-hooks";
import eslintConfigPrettier from "eslint-config-prettier";
export const nextJsConfig = [
    ...baseConfig,
    eslintConfigPrettier,
    js.configs.recommended,
    ...tseslint.configs.recommended,
    { plugins: { "@next/next": pluginNext }, rules: { ...pluginNext.configs.recommended.rules, ...pluginNext.configs["core-web-vitals"].rules } },
    { ...pluginReact.configs.flat.recommended, languageOptions: { globals: { ...globals.serviceworker }, ...pluginReact.configs.flat.recommended.languageOptions } },
    { settings: { react: { version: "detect" } }, plugins: { "react-hooks": pluginReactHooks }, rules: { "react/react-in-jsx-scope": "off", ...pluginReactHooks.configs.recommended.rules } },
];
