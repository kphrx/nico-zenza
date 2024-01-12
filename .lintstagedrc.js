export default {
  "*.{ts,js}": [
    "eslint --ignore-path .gitignore --fix",
    "prettier --ignore-path .gitignore --write --ignore-unknown",
  ],
  "!*.{ts,js}": "prettier --ignore-path .gitignore --write --ignore-unknown",
};
