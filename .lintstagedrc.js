export default {
  "*.{ts,js}": [
    "eslint --fix",
    "prettier --ignore-path .gitignore --write --ignore-unknown",
  ],
  "!*.{ts,js}": "prettier --ignore-path .gitignore --write --ignore-unknown",
};
