const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
const _ = require('lodash');
const Reporter = require('../src/index');

let expect = chai.expect;
chai.use(sinonChai);

describe('protractor-console', () => {
  let reporter, printerSpy, headerSpy, addFailureSpy;

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
    reporter.config = {};
    printerSpy = sinon.spy();
    reporter.config.logPrinter = printerSpy;

    headerSpy = sinon.spy();
    reporter.config.headerPrinter = headerSpy;

    addFailureSpy = sinon.spy();
    reporter.config.addFailure = addFailureSpy;
  });

  afterEach(() => {
    printerSpy.reset();
    headerSpy.reset();
    addFailureSpy.reset();
  });

  it('should fail tests when severe error and failOnSevere==true', () => {
    reporter.config.failOnSevere = true;
    expect(addFailureSpy).to.have.callCount(0);

    return reporter.postTest()
      .then(() => {
        expect(addFailureSpy).to.have.callCount(1);
      });
  });

  it('should not fail tests when severe error and failOnSevere==false', () => {
    reporter.config.failOnSevere = false;
    expect(addFailureSpy).to.have.callCount(0);

    return reporter.postTest()
      .then(() => {
        expect(addFailureSpy).to.have.callCount(0);
      });
  });

  it('should not fail tests when severe error and failOnSevere undefined', () => {
    expect(addFailureSpy).to.have.callCount(0);

    return reporter.postTest()
      .then(() => {
        expect(addFailureSpy).to.have.callCount(0);
      });
  });

  it('should filter by log level', () => {
    reporter.config.logLevels = ['debug'];

    return reporter.postTest()
      .then(() => {
        expect(printerSpy).to.have.callCount(0);
        expect(headerSpy).to.have.callCount(0);

        reporter.config.logLevels = ['severe'];
        return reporter.postTest.call(reporter);
      })
      .then(() => {
        expect(printerSpy).to.have.callCount(1);
        expect(headerSpy).to.have.callCount(1);
      });
  });

  it('should group identical logs into a single line', () => {
    reporter.config.logLevels = ['warning'];

    return reporter.postTest().then(() => {
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
