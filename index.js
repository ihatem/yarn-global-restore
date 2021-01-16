#!/usr/bin/env node
const preparedDeps = [];

let [, , filePath, keepVersions] = process.argv;

keepVersions =
  keepVersions && keepVersions.toLowerCase() == "--keep-versions"
    ? true
    : false;

const path = require("path");

const { sync: spawnSync } = require("cross-spawn");
const { existsSync, readFileSync } = require("fs");

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

let { dependencies } = JSON.parse(readFileSync(filePath));

if (!dependencies) {
  return console.error(colors.red, "Invalid list file");
}

for (const key of Object.keys(dependencies)) {
  preparedDeps.push(`${key}${keepVersions ? "@" + dependencies[key] : ""}`);
}
const { error } = spawnSync("yarn", ["global", "add", ...preparedDeps], {
  stdio: "inherit",
});

if (error) throw error;
