#!/usr/bin/env node

'use strict';

const fs = require('fs'),
      path = require('path');

const _ = require('lodash'),
      program = require('commander'),
      updateNotifier = require('update-notifier');

const reqdPackageJson = require('./package.json');

updateNotifier({
  packageName: reqdPackageJson.name,
  packageVersion: reqdPackageJson.version
}).notify();

program.
  version(reqdPackageJson.version).
  usage('<module> [options]').
  parse(process.argv);

if (process.argv.length === 2) {
  program.help();
}

// Get the dependency name and cut off a potential trailing slash.
const dependency = program.args[0].replace(/\/+$/, '');

fs.readdir(process.cwd(), (errReaddir, directories) => {
  if (errReaddir) {
    /* eslint-disable no-console */
    return console.log(errReaddir);
    /* eslint-enable no-console */
  }

  _.each(directories, directory => {
    fs.stat(directory, (errStat, stats) => {
      if (errStat) {
        /* eslint-disable no-console */
        return console.log(errStat);
        /* eslint-enable no-console */
      }

      /* eslint-disable consistent-return */
      if (!stats.isDirectory()) {
        return;
      }
      /* eslint-enable consistent-return */

      const packageJson = path.join(process.cwd(), directory, 'package.json');

      fs.exists(packageJson, exists => {
        if (!exists) {
          return;
        }

        /* eslint-disable global-require */
        const configuration = require(packageJson);
        /* eslint-enable global-require */

        let version;

        if (configuration.devDependencies && configuration.devDependencies[dependency]) {
          version = configuration.devDependencies[dependency];
        }

        if (configuration.dependencies && configuration.dependencies[dependency]) {
          version = configuration.dependencies[dependency];
        }

        if (version) {
          /* eslint-disable no-console */
          console.log(`${directory} (${version})`);
          /* eslint-enable no-console */
        }
      });
    });
  });
});
