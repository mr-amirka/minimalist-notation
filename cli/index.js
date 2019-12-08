#!/usr/bin/env node
const Path = require("path");
const program = require("commander");
const forIn = require("mn-utils/forIn");
const isString = require("mn-utils/isString");
const pkg = require("../package.json");
const {compileSource, defaultSettings} = require('../node');

program
    .version(pkg.version, '-v, --version')
    .option("-c, --compile [compile]", "set input path (./)")
    .option("-w --watch [watch]", "set watch")
    .option("-conf, --config [config]", "set config path (./mn-config.js)")
    .option("-a, --attrs [attrs]", "set attrs (m|class)")
    .option("-p, --prefix [prefix]", "set selectors prefix ('')")
    .option("-o, --output [output]", "set output path (./mn.styles.css)");

program.on("--help", () => {
  console.log("");
  console.log("Examples:");
  console.log("");
  console.log("$ mn --compile ./source.html");
});

program.parse(process.argv);

let path = program.compile;
let output = program.output;
let config = program.config;
let attrs = program.attrs;

if (!path) return program.help();

const settings = {
  ...defaultSettings
};

try {
  forIn(
      require(Path.resolve(config === true || !config ? './mn-config.js' : config)),
      (v, k) => v && (settings[k] = v)
  );
} catch (ex) {
  console.warn('config file is not found');
}

path && isString(path) && (settings.path = path);
output && isString(output) && (settings.output = output);
attrs && isString(attrs) && (settings.attrs = attrs);

settings.each = (path, count) => {
  console.log('MN parsed', count, 'in', path);
};
settings.finish = () => {
  console.log('MN finished!');
};

compileSource(settings);