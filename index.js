#!/usr/bin/env node
// const { dependencies } = require("./package.json");
// const yarn = require("yarn-api");
const preparedDeps = [];

let [, , filePath, keepVersions] = process.argv;

keepVersions =
  keepVersions && keepVersions.toLowerCase() == "--keep-versions"
    ? true
    : false;

const path = require("path");

const { sync: spawnSync } = require("cross-spawn");
const { existsSync, readFileSync } = require("fs");

let fileExists = false;

if (existsSync(path.join(process.cwd(), filePath))) {
  filePath = path.join(process.cwd(), filePath);
  fileExists = true;
}

if (existsSync(path.join(filePath))) {
  fileExists = true;
}

if (fileExists) {
  let { dependencies } = JSON.parse(readFileSync(filePath));
  if (dependencies) {
    for (const key of Object.keys(dependencies)) {
      preparedDeps.push(`${key}${keepVersions ? "@" + dependencies[key] : ""}`);
    }
    const { error } = spawnSync("yarn", ["global", "add", ...preparedDeps], {
      stdio: "inherit",
    });
    if (error) throw error;
  } else {
    return console.error("Invalid list file");
  }
} else {
  return console.error("File does not exist");
}
