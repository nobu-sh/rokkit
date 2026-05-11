import css from "@eslint/css";
import js from "@eslint/js";
import config from "@rokkit/config/eslint";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";

export default config({
  typescript: {
    parserOptions: {
      projectService: true,
      tsconfigRootDir: import.meta.dirname,
    },
    overrides: {
    },
  },
  react: true,
}, {
  ignores: ["**/*.module.css.d.ts"],
}, {
  files: ["**/*.{ts,tsx}"],
  extends: [
    js.configs.recommended,
    tseslint.configs.recommended,
    reactHooks.configs.flat.recommended,
    // reactRefresh.configs.vite,
  ],
  languageOptions: {
    globals: globals.browser,
  },
}, {
  files: ["**/*.css"],
  language: "css/css",
  plugins: { css },
  languageOptions: {
    tolerant: true,
  },
  rules: {
    ...css.configs.recommended.rules,
    "css/prefer-logical-properties": "warn",
    "css/relative-font-units": ["warn", { allowUnits: ["rem", "em", "%"] }],
    "css/selector-complexity": "warn",
  },
});
