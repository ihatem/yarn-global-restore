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

if (!filePath) {
  console.error("You have to specify an entry file.");
  return console.error("USAGE: yarn-global-restore <file> [--keep-versions]");
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
  return console.error("File does not exist");
}

let { dependencies } = JSON.parse(readFileSync(filePath));

if (!dependencies) {
  return console.error("Invalid list file");
}

for (const key of Object.keys(dependencies)) {
  preparedDeps.push(`${key}${keepVersions ? "@" + dependencies[key] : ""}`);
}
const { error } = spawnSync("yarn", ["global", "add", ...preparedDeps], {
  stdio: "inherit",
});

if (error) throw error;
