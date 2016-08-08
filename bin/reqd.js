#!/usr/bin/env node

'use strict';

const fs = require('fs'),
      path = require('path');

const async = require('async'),
      buntstift = require('buntstift'),
      program = require('commander'),
      updateNotifier = require('update-notifier');

const reqdPackageJson = require('../package.json');

updateNotifier({
  packageName: reqdPackageJson.name,
  packageVersion: reqdPackageJson.version
}).notify();

program.
  version(reqdPackageJson.version).
  description(reqdPackageJson.description).
  usage('<module> [options]').
  parse(process.argv);

if (process.argv.length === 2) {
  program.help();
}

// Get the dependency name and cut off a potential trailing slash.
const dependency = program.args[0].replace(/\/+$/, '');

fs.readdir(process.cwd(), (errReaddir, directories) => {
  if (errReaddir) {
    buntstift.error('Failed to read directory.');
    buntstift.exit(1);
  }

  let isDependencyUsed = false;

  async.eachSeries(directories, (directory, done) => {
    fs.stat(directory, (errStat, stats) => {
      if (errStat) {
        buntstift.error('Failed to get stats.');
        buntstift.exit(1);
      }

      if (!stats.isDirectory()) {
        return done(null);
      }

      const packageJson = path.join(process.cwd(), directory, 'package.json');

      fs.exists(packageJson, exists => {
        if (!exists) {
          return done(null);
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
          if (!isDependencyUsed) {
            buntstift.success(`The following modules use ${dependency}.`);
            buntstift.newLine();
            isDependencyUsed = true;
          }

          buntstift.list(`${directory} (${version})`);
        }

        done(null);
      });
    });
  }, err => {
    if (err) {
      buntstift.error(err.message);
      buntstift.exit(1);
    }
    if (!isDependencyUsed) {
      buntstift.error(`There is no module using ${dependency}.`);
      buntstift.exit(1);
    }

    buntstift.exit();
  });
});
