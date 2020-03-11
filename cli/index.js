#!/usr/bin/env node
const fs = require('fs');
const Path = require('path');
const program = require('commander');
const forIn = require('mn-utils/forIn');
const isString = require('mn-utils/isString');
const pkg = require('../package.json');
const {compileSource, defaultSettings} = require('../node');

const DEFAULT_CONFIG_PATH = './mn-config.js';

program
    .version(pkg.version, '-v, --version')
    .option('-c, --compile [compile]', 'set input path (./)')
    .option('-w, --watch [watch]', 'set watch')
    .option('-conf, --config [config]', 'set config path (./mn-config.js)')
    .option('-a, --attrs [attrs]', 'set attrs (m|class)')
    .option('-ac, --altColor [altColor]', 'set altColor')
    .option('-p, --prefix [prefix]', 'set selectors prefix (\'\')')
    .option('-o, --output [output]', 'set output path (./mn.styles.css)');

program.on('--help', () => {
  console.log('');
  console.log('Examples:');
  console.log('');
  console.log('$ mn --compile ./source.html');
});

program.parse(process.argv);

const watch = program.watch;
const prefix = program.prefix;
const path = program.compile;
const output = program.output;
const config = program.config;
const attrs = program.attrs;
const metrics = program.metrics;
const metricsFiles = program.metricsFiles;

const settings = {
  ...defaultSettings,
  watch: watch || false,
  selectorPrefix: prefix || '',
  altColor: program.altColor || 'on',
};

const configPath
  = Path.resolve(config === true || !config ? DEFAULT_CONFIG_PATH : config);
let hasFile;
try {
  fs.accessSync(configPath, fs.constants.R_OK);
  hasFile = true;
} catch (err) {
  console.log('config file is not found');
}
if (hasFile) {
  try {
    forIn(require(configPath), (v, k) => v && (settings[k] = v));
  } catch (err) {
    console.error(err);
  }
}

metricsFiles && isString(metricsFiles)
  && (settings.metricsFiles = metricsFiles);
metrics && isString(metrics) && (settings.metrics = metrics);
path && isString(path) && (settings.path = path);
output && isString(output) && (settings.output = output);
attrs && isString(attrs) && (settings.attrs = attrs);

if (!settings.path) return program.help();

settings.each = (path, count) => {
  // console.log('MN parsed', count, 'in', path);
};
settings.finish = () => {
  console.log('MN finished: ' + (new Date()));
};

compileSource(settings);
