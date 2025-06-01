import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { config as baseConfig } from "./base.js";
import pluginReactHooks from "eslint-plugin-react-hooks";
import eslintConfigPrettier from "eslint-config-prettier";
export const config = [
    ...baseConfig,
    eslintConfigPrettier,
    js.configs.recommended,
    ...tseslint.configs.recommended,
    pluginReact.configs.flat.recommended,
    {
        languageOptions: {
            ...pluginReact.configs.flat.recommended.languageOptions,
            globals: { ...globals.serviceworker, ...globals.browser },
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
