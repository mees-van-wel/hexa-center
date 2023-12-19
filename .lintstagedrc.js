const path = require("path");

module.exports = {
  "packages/frontend/**/*.{ts,tsx}": (filenames) => [
    `cd packages/frontend && next lint --fix --file ${filenames
      .map((f) => path.relative(process.cwd(), f))
      .join(" --file ")}`,
    `cd packages/frontend && prettier --write ${filenames.join(" ")}`,
  ],
  "packages/backend/**/*.ts": (filenames) => [
    `cd packages/backend && eslint --fix ${filenames.join(" ")}`,
    `cd packages/backend && prettier --write ${filenames.join(" ")}`,
  ],
};
