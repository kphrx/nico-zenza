export default {
  "*.ts": () => [
    "tsc --build tsconfig.build.json",
    "tsc --build tsconfig.build.json --clean",
    "eslint --ignore-path .gitignore --fix",
    "prettier --ignore-path .gitignore --write --ignore-unknown",
  ],
  "*.js": [
    "eslint --ignore-path .gitignore --fix",
    "prettier --ignore-path .gitignore --write --ignore-unknown",
  ],
  "!*.{ts,js}": "prettier --ignore-path .gitignore --write --ignore-unknown",
};
