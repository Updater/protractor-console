# protractor-console [![build status](https://travis-ci.org/Updater/protractor-console.svg?branch=master)](https://travis-ci.org/Updater/protractor-console)

Display log statements from the browser that occur while Protractor tests are running. Similar to the "Console Plugin" that comes with Protractor, but with some significant differences:

* Associates logs with individual tests, printing them after each test run. "Console Plugin" only prints logs after all tests have run, making it more difficult to understand when they occured. For this to be truly beneficial, it should be used in conjunction with a more sophisticated test reporter like https://github.com/bcaudan/jasmine-spec-reporter.

![image](https://cloud.githubusercontent.com/assets/356320/8966068/2ef16484-35fd-11e5-9df0-90273fdd9534.png)

* Allows filtering all log levels.

## Installation
```bash
npm install --save-dev protractor-console
```

## Usage
This module is implemented as a Protractor plugin. Add it in the Protractor config like so:

```javascript
exports.config = {
  plugins: [{
    package: 'protractor-console',
    logLevels: ['severe']
  }],
```

### Configuration
* `logLevels`: Inclusive `Array` filter for which log levels to show. Can be any of `'debug'`, `'info'`, `'warning'` and `'severe'`. Defaults to `['severe', 'warning']`.

