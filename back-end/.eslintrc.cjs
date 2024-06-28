/* eslint-env node */
module.exports = {
  extends: [
    "eslint:recommended",
    // "plugin:@typescript-eslint/strict-type-checked",
    // "plugin:@typescript-eslint/stylistic-type-checked",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "unused-imports", "simple-import-sort"],
  parserOptions: {
    project: __dirname + "/tsconfig.json",
    ecmaVersion: 2022,
    sourceType: "module",
    ecmaFeatures: {
      modules: true,
    },
  },
  env: {
    node: true,
  },
  root: true,
  ignorePatterns: [
    "node_modules/",
    "dist/",
    "*.config.ts",
    "esbuild.js",
    ".eslintrc.cjs",
  ],
  rules: {
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": [
      "warn",
      {
        vars: "all",
        varsIgnorePattern: "^_",
        args: "after-used",
        argsIgnorePattern: "^_",
      },
    ],
  },
};
