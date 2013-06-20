#!/usr/bin/env node

'use strict';

var fs = require('fs'),
    path = require('path');

var _ = require('underscore');

var dependency = process.argv[2];

fs.readdir(process.cwd(), function (err, directories) {
  _.each(directories, function (directory) {
    fs.stat(directory, function (err, stats) {
      if (!stats.isDirectory()) {
        return;
      }
      
      var packageJson = path.join(process.cwd(), directory, 'package.json');
      fs.exists(packageJson, function (exists) {
        if (!exists) {
          return;
        }

        var configuration = require(packageJson);
        if ((configuration.dependencies && configuration.dependencies[dependency]) ||
            (configuration.devDependencies && configuration.devDependencies[dependency])) {
          var version = configuration.dependencies[dependency] || configuration.devDependencies[dependency];

          console.log(directory + ' (' + version + ')');
        }
      });
    });
  });
});