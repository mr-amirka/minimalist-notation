#!/usr/bin/env node
const fs = require('fs');
const Path = require('path');
const program = require('commander');
const forEach = require('mn-utils/forEach');
const forIn = require('mn-utils/forIn');
const isString = require('mn-utils/isString');
const {
  getRFC3339,
} = require('mn-utils/formatTime');
const pkg = require('../package.json');
const {
  compileSource,
  defaultSettings,
} = require('../node');

const DEFAULT_CONFIG_PATH = './mn-config.js';

program
  .version(pkg.version, '-v, --version')
  .option('-c, --compile [compile]', 'set input path (./)')
  .option('-w, --watch [watch]', 'set watch')
  .option('-conf, --config [config]', `set config path (${DEFAULT_CONFIG_PATH})`)
  .option('-a, --attrs [attrs]', 'set attrs (m|class)')
  .option('-ac, --altColor [altColor]', 'set altColor')
  .option('-p, --prefix [prefix]', 'set selectors prefix (\'\')')
  .option('-m, --metrics [metrics]', 'set file path for metrics')
  .option('-mf, --metricsFiles [metricsFiles]', 'set file path for metrics with files')
  .option('-o, --output [output]', `set output path (${defaultSettings.output})`);

program.on('--help', () => {
  console.log('');
  console.log('Examples:');
  console.log('');
  console.log('$ mn --compile ./source.html');
});

program.parse(process.argv);

const config = program.config;

const settings = {
  ...defaultSettings,
  watch: program.watch || false,
  selectorPrefix: program.prefix || '',
  altColor: program.altColor || 'on',
};

const configPath
  = Path.resolve(config && isString(config) ? config : DEFAULT_CONFIG_PATH);
let hasFile;
try {
  fs.accessSync(configPath, fs.constants.R_OK);
  hasFile = true;
} catch (err) {
  console.warn('Warn: Config file is not found');
}
if (hasFile) {
  try {
    forIn(require(configPath), (v, k) => v && (settings[k] = v));
  } catch (err) {
    console.error(err);
  }
}

forEach([['compile', 'path'], ['output'], ['attrs'], ['metrics'], ['metricsFiles']], (line) => {
  const from = line[0];
  const value = program[from];
  value && isString(value) && (settings[line[1] || from] = value);
});

if (!settings.path) return program.help();

settings.each = (path, count, data) => {
  // console.log('MN parsed', count, 'in', path);
};
settings.onDone = () => {
  console.log('MN: done ' + getRFC3339());
};

compileSource(settings);
