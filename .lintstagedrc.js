export default {
  "*.ts": () => [
    "tsc -b tsconfig.build.json",
    "tsc -b tsconfig.build.json --clean",
  ],
  "*.{ts,js}": ["eslint --fix", "prettier --write --ignore-unknown"],
  "!*.{ts,js}": "prettier --write --ignore-unknown",
};
