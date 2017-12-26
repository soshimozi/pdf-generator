var loginPage = require('../support/loginPage');

module.exports = function(){

  this.Given(/^I am logging in as "([^"]*)" using password "([^"]*)"$/, function (u, p, callback) {
    loginPage.logout().then(function(){
      loginPage.go(browser.params.testUrl);
      loginPage.login(u,p).then(function(){
        callback();
      });
    });
  });

  this.When(/^I go to the application homepage$/, function (callback) {
    browser.driver.get(browser.params.testUrl).then(function(s){
      callback();
    });

  });

this.Then(/^my username should read "([^"]*)"$/, function (u, callback) {

  browser.driver.findElement(by.id('lblUsername')).getText().then(function(e){
    if(e != u){
      callback.fail(new Error('Test user is not logged in, found ' + e));
    } else {
      callback();
    }
  }).thenCatch(function(e){
    callback.fail(new Error('Could not check username, error occured: ' + e.message));
  });
});



}
