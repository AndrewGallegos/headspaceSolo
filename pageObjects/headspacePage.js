module.exports = {
    url: 'https://www.headspace.com',
    elements: {
        //homepage
        navBar: {
            selector: '//*[@data-testid="site-header"]',
            locateStrategy: 'xpath'
        },
        logInBtn: '[data-testid=site-header-login-link]',
        //log in page
        userInput: 'input[name=_username]',
        passInput: 'input[name=_password]',
        submitBtn: '[data-testid=submit]',
        //my headspace page
        profileBtn: '[data-testid=site-header-profile-link]',
        //profile
        popupBtn: '[data-testid=onboarding-notification-btn]',
        accountsBtn: '[aria-label=accounts]',
        //accounts page
        firstNameInput: '#firstname',
        lastNameInput: '#lastname',
        accountSaveBtn: '[aria-label="Save changes"]',
        logOutBtn: '[aria-label="Log out"]',
        //prompt
        popupConfirm: '[data-testid=confirm]'
    }
}