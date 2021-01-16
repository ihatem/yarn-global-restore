# yarn-global-restore

Yarn does not offer a backup/restore feature, so I created this script.

## Requirements

Backup the global package.json file

```sh
  $ cp $(yarn global dir)/package.json /path/to/your/backup/folder
```

## Usage

```sh
# use without install
$ npx https://github.com/ihatem/yarn-global-restore.git </path/to/package.json> [--keep-versions]
# install globally
$ yarn global add https://github.com/ihatem/yarn-global-restore.git
```

`--keep-versions` _(optional)_: install with saved versions, otherwise install newest versions
