// @ts-check

import eslint from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";

export default tseslint.config(
  {
    ignores: ["**/rollup.config.ts", "**/dist/", "**/.rollup.cache/"],
  },
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        project: true,
        //EXPERIMENTAL_useProjectService: true,
      },
    },
    rules: {
      ...prettier.rules,
    },
  },
  {
    files: ["**/*.js"],
    extends: [tseslint.configs.disableTypeChecked],
  },
);
