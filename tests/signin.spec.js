const { test, expect } = require('@playwright/test');

const { HomePage } = require('../pages/HomePage');
const { SignInPage } = require('../pages/SignInPage');
const { MyTicketsPage } = require('../pages/MyTicketsPage');

test.describe('Mind Matters - Sign In', () => {

    test('User should be able to sign in successfully and verify My Tickets dashboard', async ({ page }) => {

        // --------------------------------
        // 1. Open Home Page
        // --------------------------------

        const homePage = new HomePage(page);

        await homePage.openHomePage();

        await expect(page).toHaveTitle(/Mind Matters/i);


        // --------------------------------
        // 2. Click Sign In
        // --------------------------------

        const signInTab = await homePage.clickSignIn();


        // --------------------------------
        // 3. Sign In Page
        // --------------------------------

        const signInPage = new SignInPage(signInTab);

        await signInPage.verifyLoginPageLoaded();

        await expect(signInTab).toHaveURL(
            /tickets\.mindmatters-summit\.com\/login/
        );


        // --------------------------------
        // 4. Login
        // --------------------------------

        await signInPage.login(
            process.env.USER_EMAIL,
            process.env.USER_PASSWORD
        );


        // --------------------------------
        // 5. Wait for Dashboard
        // --------------------------------

        await signInTab.waitForLoadState('load');


        // --------------------------------
        // 6. Verify Dashboard URL
        // --------------------------------

        await expect(signInTab).toHaveURL(
            /tickets\.mindmatters-summit\.com\/my-tickets/
        );


        // --------------------------------
        // 7. Create My Tickets Page
        // --------------------------------

        const myTicketsPage = new MyTicketsPage(signInTab);


        // --------------------------------
        // 8. Verify Main Dashboard
        // --------------------------------

        await myTicketsPage.verifyDashboard();



        // --------------------------------
        // 9. Final Assertion
        // --------------------------------

        await expect(myTicketsPage.signOut).toBeVisible();

    });

});