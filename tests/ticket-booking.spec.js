const { test, expect } = require('@playwright/test');

const { HomePage } =
    require('../pages/HomePage');

const { SignInPage } =
    require('../pages/SignInPage');

const { MyTicketsPage } =
    require('../pages/MyTicketsPage');

const { TicketsPage } =
    require('../pages/TicketsPage');

const { AddOnsPage } =
    require('../pages/AddOnsPage');

const { PaymentReviewPage } =
    require('../pages/PaymentReviewPage');

const { PayFastPage } =
    require('../pages/PayFastPage');


test.describe('Mind Matters - Ticket Booking', () => {

    test('User should book Summit Ticket and reach PayFast', async ({ page }) => {


        // ==================================================
        // STEP 1 - HOME PAGE
        // ==================================================

        const homePage =
            new HomePage(page);

        await homePage.openHomePage();


        // ==================================================
        // STEP 2 - SIGN IN
        // ==================================================

        const signInTab =
            await homePage.clickSignIn();


        const signInPage =
            new SignInPage(signInTab);

        await signInPage.verifyLoginPageLoaded();

        await signInPage.verifyLoginPage();


        await signInPage.login(
            process.env.USER_EMAIL,
            process.env.USER_PASSWORD
        );


        // ==================================================
        // STEP 3 - MY TICKETS
        // ==================================================

        await expect(signInTab).toHaveURL(
            /tickets\.mindmatters-summit\.com\/my-tickets/
        );


        const myTicketsPage =
            new MyTicketsPage(signInTab);

        await myTicketsPage.waitForDashbordDisplay();

        await myTicketsPage.verifyDashboardPage();


        // ==================================================
        // STEP 4 - BOOK TICKET
        // ==================================================

        await myTicketsPage.clickBookTicket();


        // ==================================================
        // STEP 5 - TICKETS PAGE
        // ==================================================

        const ticketsPage =
            new TicketsPage(signInTab);

        await ticketsPage.verifyPage();


        // Get dynamic ticket price
        const ticketPrice =
            await ticketsPage.getSummitTicketPrice();

        console.log(
            `\n================================`
        );

        console.log(
            `SUMMIT TICKET PRICE: ${ticketPrice}`
        );

        console.log(
            `================================\n`
        );


        // ==================================================
        // STEP 6 - SELECT SUMMIT TICKET
        // ==================================================

        await ticketsPage.selectSummitTicket();


        // ==================================================
        // STEP 7 - PROCEED
        // ==================================================

        await ticketsPage.clickProceed();


        // ==================================================
        // STEP 8 - ADD-ONS PAGE
        // ==================================================

        const addOnsPage =
            new AddOnsPage(signInTab);

        await addOnsPage.verifyPage();


        // We don't select Immersive Experience
        await addOnsPage.clickProceed();


        // ==================================================
        // STEP 9 - PAYMENT REVIEW
        // ==================================================

        const paymentPage =
            new PaymentReviewPage(signInTab);

        await paymentPage.verifyPage();


        // Get dynamic order total
        const orderTotal =
            await paymentPage.getTotalPrice();


        console.log(
            `ORDER TOTAL: ${orderTotal}`
        );


        // Make sure a price was found
        expect(orderTotal).toBeTruthy();


        // ==================================================
        // STEP 10 - CART
        // ==================================================

        await paymentPage.clickCart();


        // We should still be on payment review
        await paymentPage.verifyPage();


        // Get total again
        const cartTotal =
            await paymentPage.getTotalPrice();


        console.log(
            `CART TOTAL: ${cartTotal}`
        );


        // Cart should not change the total
        expect(cartTotal).toBe(orderTotal);


        // ==================================================
        // STEP 11 - PROCEED TO PAY
        // ==================================================

        await paymentPage.clickProceedToPay();


        // ==================================================
        // STEP 12 - PAYFAST
        // ==================================================

        const payFastPage =
            new PayFastPage(signInTab);


        // Verify PayFast UI
        await payFastPage.verifyPage();


        // Get dynamic PayFast amount
        const payFastAmount =
            await payFastPage.getPaymentAmount();


        console.log(
            `PAYFAST AMOUNT: ${payFastAmount}`
        );


        console.log(
            '\n========================================'
        );

        console.log(
            'PAYFAST PAGE VERIFIED SUCCESSFULLY'
        );

        console.log(
            '========================================\n'
        );

    });

});