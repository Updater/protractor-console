const _ = require('lodash');
const Chalk = require('chalk');

// Need to explicitly enable colors, probably for the same reason as:
// https://github.com/bcaudan/jasmine-spec-reporter/issues/36
var chalk = new Chalk.constructor({
  enabled: true
});

const LEVELS = {
  debug: {
    name: 'debug',
    color: 'cyan'
  },
  info: {
    name: 'info',
    color: 'magenta'
  },
  warning: {
    name: 'warning',
    color: 'yellow'
  },
  severe: {
    name: 'severe',
    color: 'red'
  }
};

const DEFAULT_LOG_LEVELS = [
  LEVELS.warning.name,
  LEVELS.severe.name
];

// http://stackoverflow.com/questions/1879860/most-reliable-split-character
const SPLIT_CHAR = '\u0007';

module.exports = {
  enabled: true,

  setup: function() {
    // Disable the plugin if `browser.manage().logs()` isn't supported by the browser driver.
    // E.g. GeckoDriver currently doesn't support this call and blows up with a stacktrace.
    // https://github.com/SeleniumHQ/selenium/issues/2972
    browser.manage().logs().get('browser').then(null, () => {
      this.enabled = false;

      logPrinter({
        message: 'Protractor Console: This browser does not appear to support retrieving logs.',
        level: 'warning',
      });
    });
  },

  postTest: function() {
    let addFailure = this.addFailure;
    let config = this.config;

    if (!this.enabled) {
      return;
    }

    return browser.manage().logs().get('browser')
      .then(result => {
        result = result.filter(byLogLevel, config);

        if (result.length === 0) {
          return;
        }

        if (config.failOnMessage) {
          addFailure('Unexpected console messages were logged.');
        }

        printHeader.call(config);

        _(result)
          .chain()
          .reduce(group, {})
          .forEach(printLog, config)
          .value();
      });
  }
};

function getLogLevels() {
  return this.logLevels || DEFAULT_LOG_LEVELS;
}

function byLogLevel(log) {
  return getLogLevels.call(this)
    .map(name => name.toLowerCase())
    .indexOf(log.level.name.toLowerCase()) !== -1;
}

function group(result, log) {
  let message = log.message;
  let id = [message, log.level.name].join(SPLIT_CHAR);
  result[id] = result[id] ? ++result[id] : 1;
  return result;
}

function printHeader() {
  (this.headerPrinter || headerPrinter).call(this);
}

function headerPrinter() {
  let header = `Test console output (log levels: ${getLogLevels.call(this).join(', ')})`;
  console.log(chalk.underline(header));
}

function printLog(count, log) {
  let split = log.split(SPLIT_CHAR);
  let options = {
    message: split[0],
    level: split[1],
    count
  };
  let printer = this.logPrinter || logPrinter;
  printer.call(printer, options);
}

function logPrinter({message, level, count}) {
  let color = chalk[LEVELS[level.toLowerCase()].color];
  let args = [color(message)];

  if (count > 1) {
    args.push(`(${count})`);
  }

  console.log.apply(console, args);
}
