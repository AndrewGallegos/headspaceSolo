var clearSetValue = function (selector, value) {
    page.clearValue(selector)
        .setValue(selector, value)
}
var dismissPopup = function () {
    page.pause(500)
    page.api.element('css selector', '[data-testid=onboarding-notification-btn]', function (result) {
        if (result.status != -1) {
            page.click('@popupBtn')
            console.log('***Popup appeared... dismissing***')
        }
    })
}
var goToAccount = function () {
    //just in case the welcome popup appears, dismiss it
    dismissPopup()
    page.click('@profileBtn')
        .waitForElementVisible('@accountsBtn')
    //just in case the profile popup appears, dismiss it
    dismissPopup()
    page.click('@accountsBtn')
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
                .verify.urlContains(element)
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
        goToAccount()
        changeUserInfo(name.newFirst, name.newLast)
        //teardown
        changeUserInfo(name.oldFirst, name.oldLast)
    },

    'Footer Links': function () {
        var urlList = [
            //GET SOME HEADSPACE section
            'https://www.headspace.com/subscriptions',
            'https://www.headspace.com/code',
            'https://www.headspace.com/buy/gift',
            'https://www.headspace.com/meditation/guided-meditation',
            'https://www.headspace.com/work',
            'https://www.headspace.com/meditation/kids',
            'https://www.headspace.com/meditation/sleep',
            'https://www.headspace.com/meditation/focus',
            'https://www.headspace.com/meditation/stress',
            'https://www.headspace.com/meditation/anxiety',
            //OUR COMMUNITY section
            'https://www.headspace.com/blog',
            //ABOUT US section
            'https://www.headspace.com/about-us',
            'https://www.headspace.com/andy-puddicombe',
            'https://www.headspace.com/headspace-meditation-books',
            'https://www.headspace.com/press-and-media',
            'https://www.headspace.com/join-us',
            //SUPPORT section
            'https://help.headspace.com/',
            'https://www.headspace.com/contact-us',
            'https://www.headspace.com/alexa',
            'https://www.headspace.com/google-assistant',
            //PARTNERSHIPS section
            'https://www.headspace.com/science/meditation-research',
            'https://www.headspace.com/partners',
            'https://www.headspace.com/philanthropy',
            //GET THE APP section
            'https://play.google.com/store/apps/details?id=com.getsomeheadspace.android',
            'https://apps.apple.com/us/app/headspace-guided-meditation-and-mindfulness/id493145008',
            //social media section
            'https://www.instagram.com/headspace/',
            'https://twitter.com/Headspace',
            'https://www.facebook.com/Headspace',
            'https://www.youtube.com/user/Getsomeheadspace',
            'www.linkedin.com%2Fcompany%2Fheadspace-meditation-limited' //the snippet present at the end of the URL, because LinkedIn requires you to log in
        ]
        //iterate through sections of the footer, each iteration testing each link in each section
        page.navigate()
        urlList.forEach(function (value, index) {
            page.useXpath()
                .click('(' + page.elements.footer.selector + '//*[@href])[' + (index + 1) + ']')
                .useCss()
                .waitForElementVisible('body')
                .verify.urlContains(value)
            page.navigate()
                .waitForElementVisible('body')
        })
    },

    'Sign Out': function () {
        //navigate to profile and then account
        //click on the signout button, then confirm with the popup
        //after homepage is loaded, verify that you are not logged in
        page.click('@myHeadspaceBtn')
            .waitForElementVisible('@profileBtn')
        goToAccount()
        page.click('@accountSection')
            .click('@logOutBtn')
            .pause(500)
            .click('@popupConfirm')
            .waitForElementVisible('@logInBtn')
            .expect.url().to.not.contain('my') //make sure that the url is not at https://my.headspace.com
    },
}