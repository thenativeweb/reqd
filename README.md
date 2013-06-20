# dep

dep searches repositories for dependencies.

## Installation

At the moment, installation of this module must be made manually.

    $ npm install -g git+ssh://git@github.com:thenativeweb/dep.git

## Quick start

To use `dep` simply call it within a directory and provide a module name.

    $ dep [modulename]

As a result `dep` will give you a list of all sub-directories where the given module is either referenced as a `dependency` or a `devDependency` in the appropriate `package.json` file.

## Running the tests

At the moment, there are no tests.

Nevertheless, this module can be built using [Grunt](http://gruntjs.com/). This analyses the code using [JSHint](http://www.jshint.com/). To run Grunt, go to the folder where you have installed dep and run `grunt`. You need to have [grunt-cli](https://github.com/gruntjs/grunt-cli) installed.

    $ grunt