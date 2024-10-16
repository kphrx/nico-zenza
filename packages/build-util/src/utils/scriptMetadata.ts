/**
 * MIT License
 *
 * Copyright (c) 2021 Gerald <gera2ld@live.com>
 *
 * This code is a copy and modify of src/util.ts from <https://github.com/violentmonkey/rollup-plugin-userscript>.
 */

const META_START = "// ==UserScript==";
const META_END = "// ==/UserScript==";

const compareEntryKey = ([a]: [string, string], [b]: [string, string]) => {
  if (a.toLowerCase() > b.toLowerCase()) {
    return 1;
  }
  if (a.toLowerCase() < b.toLowerCase()) {
    return -1;
  }
  return 0;
};

export function getScriptMetadata(
  meta: string,
  overrideMetadata: Partial<{
    version: string;
    description: string;
    license: string;
    author: string;
    supportURL: string;
    homepageURL: string;
    downloadURL: string;
    updateURL: string;
  }>,
  additionalRequireList = new Set<string>(),
) {
  const {
    version,
    description,
    license,
    author,
    supportURL,
    homepageURL,
    downloadURL,
    updateURL,
  } = overrideMetadata;
  const lines = meta.split("\n").map((line) => line.trim());
  const start = lines.indexOf(META_START);
  const end = lines.indexOf(META_END);

  let scriptNS: string | undefined;
  const overrideMap = new Map<string, string>();
  const nameMap = new Map<string, string>();
  const descMap = new Map<string, string>();
  const requireSet = new Set<string>();
  const entries: [string, string][] = lines
    .slice(start + 1, end)
    .map((line) => {
      if (!line.startsWith("// ")) return;

      line = line.slice(3).trim();
      const matches = /^(\S+)(\s.*)?$/.exec(line);

      if (matches == null) return;
      const key = matches[1];
      const value = (matches[2] || "").trim();

      if (
        [
          "@version",
          "@license",
          "@author",
          "@supportURL",
          "@homepageURL",
          "@downloadURL",
          "@updateURL",
        ].includes(key)
      ) {
        overrideMap.set(key, value);
        return;
      }

      if (key === "@require") {
        requireSet.add(value);
        return;
      }

      if (key === "@namespace") {
        scriptNS = value;
        return;
      }

      if (key === "@name") {
        nameMap.set("und", value);
        return;
      }

      if (key.startsWith("@name:")) {
        const lang = key.slice(6).trim();
        nameMap.set(lang, value);
        return;
      }

      if (key === "@description") {
        descMap.set("und", value);
        return;
      }

      if (key.startsWith("@description:")) {
        const lang = key.slice(13).trim();
        descMap.set(lang, value);
        return;
      }

      return [key, value];
    })
    .filter((e): e is [string, string] => e != null);

  for (const item of additionalRequireList) {
    requireSet.add(item);
  }
  const requireList = Array.from(requireSet);
  for (const item of requireList.toSorted()) {
    entries.push(["@require", item]);
  }

  if (author != null) overrideMap.set("@author", author);
  if (license != null) overrideMap.set("@license", license);
  if (supportURL != null) overrideMap.set("@supportURL", supportURL);
  if (homepageURL != null) overrideMap.set("@homepageURL", homepageURL);
  if (downloadURL != null) overrideMap.set("@downloadURL", downloadURL);
  if (updateURL != null) overrideMap.set("@updateURL", updateURL);
  const overrideEntries = [
    ["@author", overrideMap.get("@author")],
    ["@license", overrideMap.get("@license")],
    ["@supportURL", overrideMap.get("@supportURL")],
    ["@homepageURL", overrideMap.get("@homepageURL")],
    ["@downloadURL", overrideMap.get("@downloadURL")],
    ["@updateURL", overrideMap.get("@updateURL")],
  ].filter((e): e is [string, string] => e[1] != null);

  const nameEntries: [string, string][] = [];
  for (const [lang, value] of Array.from(nameMap.entries()).toSorted(
    compareEntryKey,
  )) {
    if (lang === "und") {
      continue;
    }
    nameEntries.unshift([`@name:${lang}`, value]);
  }

  if (description != null) descMap.set("und", description);
  const descEntries: [string, string][] = [];
  for (const [lang, value] of Array.from(descMap.entries()).toSorted(
    compareEntryKey,
  )) {
    if (lang === "und") {
      descEntries.unshift(["@description", value]);
      continue;
    }
    descEntries.push([`@description:${lang}`, value]);
  }

  entries.unshift(
    ["@name", nameMap.get("und") ?? "New Script"],
    ...nameEntries,
    ["@namespace", scriptNS ?? "http://example.com"],
    ["@version", version ?? overrideMap.get("@version") ?? "0.1.0"],
    ...descEntries,
    ...overrideEntries,
  );

  const maxKeyWidth = Math.max(...entries.map(([key]) => key.length));
  return [
    META_START,
    ...entries.map(([key, value]) => `// ${key.padEnd(maxKeyWidth)} ${value}`),
    META_END,
  ].join("\n");
}
