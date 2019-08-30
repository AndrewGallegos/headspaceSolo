var clearSetValue = function (selector, value) {
    page.clearValue(selector)
        .setValue(selector, value)
}
var dismissPopup = function () {
    page.api.element('tag name', '@popupBtn', function (result) {
        if (result.value.status != -1) {
            page.click('@popupBtn')
            console.log('***Popup appeared... dismissing***')
        }
    })
}
var changeUserInfo = function (firstName, lastName) {
    //click on the first name input to enable editing, then input new first and last name
    //when finished, click save, wait, then run assertions
    page.click('@firstNameInput')
    clearSetValue('@firstNameInput', firstName)
    clearSetValue('@lastNameInput', lastName)
    page.click('@accountSaveBtn')
        .pause(500)
        .expect.element('@profileBtn').text.to.match(new RegExp(firstName, 'i'))
    page.expect.element('@firstNameInput').value.to.equal(firstName)
    page.expect.element('@lastNameInput').value.to.equal(lastName)
}
var page
module.exports = {
    before: browser => {
        browser.windowSize('current', 1366, 768)
        page = browser.page.headspacePage()
        page.navigate()
            .waitForElementVisible('body')
    },
    after: function () { page.end() },

    'Navigation bar': function () {
        var urlList = [
            'https://www.headspace.com',
            'https://www.headspace.com/science',
            'https://www.headspace.com/blog',
            'https://www.headspace.com/work',
            'https://www.headspace.com/meditation-101/what-is-meditation',
            'https://help.headspace.com/',
            'https://www.headspace.com/login',
            'https://www.headspace.com/register'
        ]
        //for each button on the navigation bar, click it and verify that it directs to the correct URL
        urlList.forEach((element, index) => {
            page.api.useXpath()
            page.click('(' + page.elements.navBar.selector + '//a)[' + (index + 1) + ']')
            page.api.useCss()
            page.waitForElementVisible('body')
                .expect.url().to.contain(element)
            page.navigate()
                .waitForElementVisible('body')
        });
    },

    'Sign In': function () {
        var credentials = {
            email: 'qa.placeholder@gmail.com',
            password: 'timtp123'
        }
        //click on login button from homepage, then input credentials and press the submit button
        page.click('@logInBtn')
            .waitForElementVisible('@userInput')
        clearSetValue('@userInput', credentials.email)
        clearSetValue('@passInput', credentials.password)
        page.click('@submitBtn')
            .waitForElementVisible('@profileBtn', 10000)
            .expect.url().to.contain('https://my.headspace.com/')
    },

    'Edit Profile Information': function () {
        var name = {
            newFirst: 'Changed',
            newLast: 'Information',
            oldFirst: 'QA',
            oldLast: 'Test'
        }
        //just in case the welcome popup appears, dismiss it
        dismissPopup()
        page.click('@profileBtn')
            .waitForElementVisible('@accountsBtn')
        //just in case the profile popup appears, dismiss it
        dismissPopup()
        page.click('@accountsBtn')
        changeUserInfo(name.newFirst, name.newLast)
        //teardown
        changeUserInfo(name.oldFirst, name.oldLast)
    },

    'Sign Out': function () {
        //click on the signout button, then confirm with the popup
        //after homepage is loaded, verify that you are not logged in
        page.click('@logOutBtn')
            .click('@popupConfirm')
            .waitForElementVisible('@logInBtn')
            .expect.url().to.not.contain('my') //make sure that the url is not at https://my.headspace.com
    }
}