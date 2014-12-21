#!/usr/bin/env node

'use strict';

var fs = require('fs'),
    path = require('path');

var _ = require('lodash');

// Get the dependency name and cut off a potential trailing slash.
var dependency = process.argv[2].replace(/\/+$/, '');

fs.readdir(process.cwd(), function (err, directories) {
  if (err) {
    /*eslint-disable no-console*/
    return console.log(err);
    /*eslint-enable no-console*/
  }

  _.each(directories, function (directory) {
    fs.stat(directory, function (err, stats) {
      var packageJson;

      if (err) {
        /*eslint-disable no-console*/
        return console.log(err);
        /*eslint-enable no-console*/
      }

      /*eslint-disable consistent-return*/
      if (!stats.isDirectory()) {
        return;
      }
      /*eslint-enable consistent-return*/

      packageJson = path.join(process.cwd(), directory, 'package.json');
      fs.exists(packageJson, function (exists) {
        var configuration,
            version;

        if (!exists) {
          return;
        }

        configuration = require(packageJson);

        if (configuration.devDependencies && configuration.devDependencies[dependency]) {
          version = configuration.devDependencies[dependency];
        }

        if (configuration.dependencies && configuration.dependencies[dependency]) {
          version = configuration.dependencies[dependency];
        }

        if (version) {
          /*eslint-disable no-console*/
          console.log(directory + ' (' + version + ')');
          /*eslint-enable no-console*/
        }
      });
    });
  });
});
