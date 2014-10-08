#!/usr/bin/env node

'use strict';

var fs = require('fs'),
    path = require('path');

var _ = require('lodash');

var dependency = process.argv[ 2 ];

fs.readdir(process.cwd(), function (err, directories) {
  if (err) {
    return console.log(err);
  }

  _.each(directories, function (directory) {
    fs.stat(directory, function (err, stats) {
      var packageJson;

      if (err) {
        return console.log(err);
      }

      if (!stats.isDirectory()) {
        /*eslint-disable consistent-return*/
        return;
        /*eslint-enable consistent-return*/
      }

      packageJson = path.join(process.cwd(), directory, 'package.json');
      fs.exists(packageJson, function (exists) {
        var configuration,
            version;

        if (!exists) {
          return;
        }

        configuration = require(packageJson);
        if ((configuration.dependencies && configuration.dependencies[ dependency ]) ||
            (configuration.devDependencies && configuration.devDependencies[ dependency ])) {
          version = configuration.dependencies[ dependency ] || configuration.devDependencies[ dependency ];

          console.log(directory + ' (' + version + ')');
        }
      });
    });
  });
});
