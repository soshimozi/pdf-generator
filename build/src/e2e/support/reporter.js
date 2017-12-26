var reporter = require('cucumber-junit-reporter');

module.exports = reporter({
  reportDir: 'test_results/'
});
