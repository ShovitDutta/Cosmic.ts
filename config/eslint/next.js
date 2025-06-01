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
    js.configs.recommended,
    eslintConfigPrettier,
    ...tseslint.configs.recommended,
    {
        ...pluginReact.configs.flat.recommended,
        languageOptions: {
            globals: { ...globals.serviceworker },
            ...pluginReact.configs.flat.recommended.languageOptions,
        },
    },
    {
        plugins: { "@next/next": pluginNext },
        rules: {
            ...pluginNext.configs.recommended.rules,
            ...pluginNext.configs["core-web-vitals"].rules,
        },
    },
    {
        settings: { react: { version: "detect" } },
        plugins: { "react-hooks": pluginReactHooks },
        rules: {
            "react/react-in-jsx-scope": "off",
            ...pluginReactHooks.configs.recommended.rules,
        },
    },
];
