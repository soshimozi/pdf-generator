var loginPage = function() {

	this.logout = function(){
		return browser.driver.get(browser.baseUrl + '/notyou');
	}

	this.go = function(redirectPage){
		var loginUrl = browser.params.loginUrl + '/loginexplicit?sip=exception&redirect=' + encodeURIComponent(redirectPage);
		return browser.driver.get(loginUrl);
	}

	this.login = function(userName, password){

		browser.driver.findElement(by.id("UserName")).sendKeys(userName);
		browser.driver.findElement(by.id("Password")).sendKeys(password);
		return browser.driver.findElement(by.tagName("button")).click();
	}

}

module.exports = new loginPage();
