import sinon from 'sinon';
import chai from 'chai';
import sinonChai from 'sinon-chai';

let expect = chai.expect;
chai.use(sinonChai);

import _ from 'lodash';
import Reporter from '../src/index';

describe('protractor-console', () => {

  let reporter, config, printerSpy;

  beforeEach(() => {
    let browser = global.browser = {};
    browser.manage = () => {
      return {
        logs: () => {
          return {
            get: () => {
              return Promise.resolve(getSampleOutput());
            }
          };
        }
      };
    };

    // Workaround for lack of "new"ing the plugin, resetting before each test run.
    reporter = _.cloneDeep(Reporter);

    config = {};
    printerSpy = sinon.spy();
    config.logPrinter = printerSpy;

    // Not explicitly testing, just surpressing header output from test results
    config.headerPrinter = sinon.spy();
  });

  afterEach(() => {
    printerSpy.reset();
  });

  it('should filter by log level', () => {
    config.logLevels = ['debug'];

    return reporter.postTest(config)
      .then(() => {
        expect(printerSpy).to.have.callCount(0);

        config.logLevels = ['severe'];
        return reporter.postTest(config);
      })
      .then(() => {
        expect(printerSpy).to.have.callCount(1);
      });
  });

  it('should group identical logs into a single line', () => {
    config.logLevels = ['warning'];

    return reporter.postTest(config).then(() => {
      let match1 = getSampleOutput()[1];
      let match2 = getSampleOutput()[6];

      expect(printerSpy).to.have.been.calledTwice;
      expect(printerSpy).to.have.been.calledWithMatch({
        message: match1.message,
        level: match1.level.name,
        count: 5
      });
      expect(printerSpy).to.have.been.calledWithMatch({
        message: match2.message,
        level: match2.level.name,
        count: 1
      });
    });
  });
});

/*jslint maxlen: 250 */

function getSampleOutput() {
  return [{
    level: {
      value: 800,
      name: 'INFO'
    },
    message: 'Could not read chrome manifest \'file:///Applications/Firefox.app/Contents/Resources/chrome.manifest\'.',
    timestamp: 1437581541737,
    type: ''
  }, {
    level: {
      value: 900,
      name: 'WARNING'
    },
    message: 'Expected \'none\' or URL but found \'progid\'.  Error in parsing value for \'filter\'.  Declaration dropped.',
    timestamp: 1437581545462,
    type: ''
  }, {
    level: {
      value: 900,
      name: 'WARNING'
    },
    message: 'Expected \'none\' or URL but found \'progid\'.  Error in parsing value for \'filter\'.  Declaration dropped.',
    timestamp: 1437581545462,
    type: ''
  }, {
    level: {
      value: 900,
      name: 'WARNING'
    },
    message: 'Expected \'none\' or URL but found \'progid\'.  Error in parsing value for \'filter\'.  Declaration dropped.',
    timestamp: 1437581545462,
    type: ''
  }, {
    level: {
      value: 900,
      name: 'WARNING'
    },
    message: 'Expected \'none\' or URL but found \'progid\'.  Error in parsing value for \'filter\'.  Declaration dropped.',
    timestamp: 1437581545463,
    type: ''
  }, {
    level: {
      value: 900,
      name: 'WARNING'
    },
    message: 'Expected \'none\' or URL but found \'progid\'.  Error in parsing value for \'filter\'.  Declaration dropped.',
    timestamp: 1437581545463,
    type: ''
  }, {
    level: {
      value: 900,
      name: 'WARNING'
    },
    message: 'mutating the [[Prototype]] of an object will cause your code to run very slowly; instead create the object with the correct initial [[Prototype]] value using Object.create',
    timestamp: 1437581545969,
    type: ''
  }, {
    level: {
      value: 1000,
      name: 'SEVERE'
    },
    message: 'http://api.site.com/ 0:0 Failed to load resource: the server responded with a status of 401 (Unauthorized)',
    timestamp: 1437581551742,
    type: ''
  }];
}
