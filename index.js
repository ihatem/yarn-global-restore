#!/usr/bin/env node
const path = require("path");
const { sync: spawnSync } = require("cross-spawn");
const { existsSync, readFileSync } = require("fs");

const preparedDeps = [];

let [, , filePath, keepVersions] = process.argv;

keepVersions = keepVersions && keepVersions.toLowerCase() == "--keep-versions";

const colors = {
  red: "\x1b[31m",
  yellow: "\x1b[33m",
};

if (!filePath) {
  console.error(colors.red, "You have to specify an entry file.");
  return console.error(
    colors.yellow,
    "USAGE: yarn-global-restore <file> [--keep-versions]"
  );
}

let fileExists = false;

if (existsSync(path.join(process.cwd(), filePath))) {
  filePath = path.join(process.cwd(), filePath);
  fileExists = true;
}

if (existsSync(path.join(filePath))) {
  fileExists = true;
}

if (!fileExists) {
  return console.error(colors.red, "File does not exist");
}

try {
  let { dependencies } = JSON.parse(readFileSync(filePath));
  for (const key of Object.keys(dependencies)) {
    preparedDeps.push(`${key}${keepVersions ? "@" + dependencies[key] : ""}`);
  }

  // Install every package separately to prevent exit when one package is invalid
  for (const dep of preparedDeps) {
    const { error } = spawnSync("yarn", ["global", "add", dep], {
      stdio: "inherit",
    });

    if (error) console.error(colors.red, error);
  }
} catch (err) {
  return console.error(colors.red, "Invalid list file");
}
