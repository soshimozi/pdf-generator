var loginPage = require('../support/loginPage');

module.exports = function(){
  this.Then(/^I should see the greeting "([^"]*)"$/, function (greeting, callback) {
    // Write code here that turns the phrase above into concrete actions
    element(by.id('greeting')).getText().then(function(text){
      if(text == greeting){
        callback();
      } else {
        callback.fail(new Error("Greeting not found"));
      }
    })
  });
}
