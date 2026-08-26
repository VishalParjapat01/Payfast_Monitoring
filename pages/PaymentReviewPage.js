// const { BasePage } = require('./BasePage');
// const { expect } = require('@playwright/test');

// class PaymentReviewPage extends BasePage {

//     constructor(page) {
//         super(page);

//         this.ticketsSelectedHeading =
//             page.getByText('Tickets Selected', {
//                 exact: true
//             });

//         this.orderBreakdown =
//             page.getByText('Order Breakdown', {
//                 exact: true
//             });

//         this.totalText =
//             page.getByText('Total', {
//                 exact: true
//             });

//         this.proceedToPayButton =
//             page.getByRole('button', {
//                 name: 'Proceed to Pay',
//                 exact: true
//             });

//         this.redirectLoader = page.getByText(
//             'Redirecting to secure payment...',
//             { exact: false }
//         );

//         this.requestInvoiceButton =
//             page.getByRole('button', {
//                 name: 'Request Invoice',
//                 exact: true
//             });

//         this.cartButton =
//             page.getByRole('button', {
//                 name: /Cart/
//             });
//     }

//     async verifyPageLoaded() {

//         await this.pageHeading.waitFor({
//             state: 'visible'
//         });

//         await this.orderBreakdown.waitFor({
//             state: 'visible'
//         });

//         await this.proceedToPayButton.waitFor({
//             state: 'visible'
//         });
//     }

//     async verifyPage() {

//         await expect(
//             this.ticketsSelectedHeading
//         ).toBeVisible();

//         await expect(
//             this.orderBreakdown
//         ).toBeVisible();

//         await expect(
//             this.totalText
//         ).toBeVisible();

//         await expect(
//             this.proceedToPayButton
//         ).toBeVisible();

//         await expect(
//             this.requestInvoiceButton
//         ).toBeVisible();
//     }

//     // async getTotalPrice() {

//     //     const bodyText = await this.page.locator('body').innerText();

//     //     const totalSection = bodyText.match(
//     //         /Total\s+R\s*([\d\s,]+)/
//     //     );

//     //     if (!totalSection) {
//     //         throw new Error(
//     //             'Order total price was not found'
//     //         );
//     //     }

//     //     return `R ${totalSection[1].trim()}`;
//     // }

//     async getTotalPrice() {

//         const bodyText =
//             await this.page.locator('body').innerText();

//         /*
//          * Find the Total section.
//          *
//          * Example:
//          * Total
//          * R 5500
//          */

//         const match = bodyText.match(
//             /Total\s+R\s*([\d\s,]+)/
//         );

//         if (!match) {

//             throw new Error(
//                 'Order total price was not found'
//             );
//         }

//         const total = `R ${match[1].trim()}`;

//         console.log(
//             `ORDER TOTAL: ${total}`
//         );

//         return total;
//     }


//     async printTotalPrice() {

//         const price = await this.getTotalPrice();

//         console.log(
//             `\n========== ORDER TOTAL: ${price} ==========\n`
//         );

//         return price;
//     }

//     async clickCart() {

//         await this.cartButton.click();

//         await this.page.waitForLoadState('domcontentloaded');
//         await this.waitForPageLoad();
//     }

//     async clickProceedToPay() {

//         await expect(this.proceedToPayButton).toBeVisible({
//             timeout: 15000
//         });

//         await expect(this.proceedToPayButton).toBeEnabled({
//             timeout: 15000
//         });

//         // Wait for purchase API
//         const purchaseResponsePromise = this.page.waitForResponse(
//             response =>
//                 response.url().includes('/purchase/buy') &&
//                 response.request().method() === 'POST',
//             {
//                 timeout: 30000
//             }
//         );

//         const payFastUrl = /payfast\.(?:io|co\.za)/;

//         console.log('Clicking Proceed to Pay...');

//         await this.proceedToPayButton.click();

//         const purchaseResponse = await purchaseResponsePromise;

//         console.log(
//             'Purchase status:',
//             purchaseResponse.status()
//         );

//         if (!purchaseResponse.ok()) {
//             throw new Error(
//                 `Purchase failed: HTTP ${purchaseResponse.status()}`
//             );
//         }

//         let purchaseBody = null;
//         try {
//             purchaseBody = await purchaseResponse.json();
//         } catch (error) {
//             throw new Error(
//                 'Purchase returned HTTP 200 but no JSON payment handoff response.'
//             );
//         }

//         const purchaseText = JSON.stringify(purchaseBody).toLowerCase();
//         const hasPaymentHandoff =
//             purchaseText.includes('payfast') ||
//             purchaseText.includes('payment_url') ||
//             purchaseText.includes('paymenturl') ||
//             purchaseText.includes('redirect');

//         if (!hasPaymentHandoff) {
//             throw new Error(
//                 `Purchase returned HTTP 200 without a PayFast handoff: ` +
//                 `${JSON.stringify(purchaseBody)}`
//             );
//         }

//         console.log('Purchase returned a payment handoff.');

//         console.log(
//             'Waiting for PayFast...',
//             this.page.url()
//         );

//         let verifiedPayFastPage = null;
//         try {
//             await expect.poll(
//                 () => {
//                     verifiedPayFastPage = this.page.context().pages().find(
//                         page => payFastUrl.test(page.url())
//                     ) || null;
//                     return Boolean(verifiedPayFastPage);
//                 },
//                 {
//                     timeout: 90000,
//                     intervals: [250, 500, 1000, 2000]
//                 }
//             ).toBe(true);
//         } catch (error) {
//             throw new Error(
//                 `PayFast navigation did not complete after purchase. ` +
//                 `Current page: ${this.page.url()}`
//             );
//         }

//         await expect(verifiedPayFastPage).toHaveURL(payFastUrl, {
//             timeout: 10000
//         });

//         console.log(
//             'PayFast loaded:',
//             verifiedPayFastPage.url()
//         );

//         return verifiedPayFastPage;
//     }
// }

// module.exports = { PaymentReviewPage };


const { BasePage } = require('./BasePage');
const { expect } = require('@playwright/test');

class PaymentReviewPage extends BasePage {

    constructor(page) {
        super(page);

        // ==========================================
        // PAGE ELEMENTS
        // ==========================================

        this.ticketsSelectedHeading = page.getByText(
            'Tickets Selected',
            {
                exact: true
            }
        );

        this.orderBreakdown = page.getByText(
            'Order Breakdown',
            {
                exact: true
            }
        );

        this.totalText = page.getByText(
            'Total',
            {
                exact: true
            }
        );

        this.proceedToPayButton = page.getByRole(
            'button',
            {
                name: 'Proceed to Pay',
                exact: true
            }
        );

        this.requestInvoiceButton = page.getByRole(
            'button',
            {
                name: 'Request Invoice',
                exact: true
            }
        );

        this.cartButton = page.getByRole(
            'button',
            {
                name: /Cart/
            }
        );

        // ==========================================
        // REDIRECT LOADER
        // ==========================================

        /*
         * The website may display this message while
         * redirecting the user to PayFast.
         */
        this.redirectLoader = page.getByText(
            'Redirecting to secure payment...',
            {
                exact: false
            }
        );

        // ==========================================
        // URLS
        // ==========================================

        this.paymentReviewUrl =
            /\/summit-2026\/payment-review/;

        /*
         * PayFast opens in the SAME TAB.
         *
         * Example:
         *
         * https://payment.payfast.io/eng/process/payment/
         * 936e5f4b-06da-4c6e-97d4-0a51dcd60b99
         *
         * The UUID changes for every transaction.
         *
         * Therefore we only verify:
         *
         * https://payment.payfast.io/eng/process/payment/
         */

        this.payFastUrl =
            /^https:\/\/payment\.payfast\.io\/eng\/process\/payment\//;
    }

    // ==========================================
    // VERIFY PAGE LOADED
    // ==========================================

    async verifyPageLoaded() {

        await expect(
            this.ticketsSelectedHeading
        ).toBeVisible({
            timeout: 15000
        });

        await expect(
            this.orderBreakdown
        ).toBeVisible({
            timeout: 15000
        });

        await expect(
            this.proceedToPayButton
        ).toBeVisible({
            timeout: 15000
        });

        console.log(
            'Payment Review page loaded.'
        );
    }

    // ==========================================
    // VERIFY COMPLETE PAGE
    // ==========================================

    async verifyPage() {

        await expect(
            this.ticketsSelectedHeading
        ).toBeVisible({
            timeout: 15000
        });

        await expect(
            this.orderBreakdown
        ).toBeVisible({
            timeout: 15000
        });

        await expect(
            this.totalText
        ).toBeVisible({
            timeout: 15000
        });

        await expect(
            this.proceedToPayButton
        ).toBeVisible({
            timeout: 15000
        });

        await expect(
            this.proceedToPayButton
        ).toBeEnabled({
            timeout: 15000
        });

        await expect(
            this.requestInvoiceButton
        ).toBeVisible({
            timeout: 15000
        });

        console.log(
            'Payment Review page verified.'
        );
    }

    // ==========================================
    // CART
    // ==========================================

    async clickCart() {

        await expect(
            this.cartButton
        ).toBeVisible({
            timeout: 15000
        });

        await this.cartButton.click();

        await expect(
            this.page
        ).toHaveURL(
            /\/summit-2026\/tickets/,
            {
                timeout: 30000
            }
        );

        console.log(
            'Returned to Tickets page.'
        );
    }

    // ==========================================
    // PROCEED TO PAY
    // ==========================================

    async clickProceedToPay() {

        console.log(
            '\n========================================'
        );

        console.log(
            'CLICKING PROCEED TO PAY'
        );

        console.log(
            '========================================'
        );

        // ==========================================
        // VERIFY BUTTON
        // ==========================================

        await expect(
            this.proceedToPayButton
        ).toBeVisible({
            timeout: 15000
        });

        await expect(
            this.proceedToPayButton
        ).toBeEnabled({
            timeout: 15000
        });

        console.log(
            'Proceed to Pay button is visible and enabled.'
        );

        // ==========================================
        // WAIT FOR PURCHASE API
        // ==========================================

        const purchaseResponsePromise =
            this.page.waitForResponse(
                response =>
                    response.url().includes('/purchase/buy') &&
                    response.request().method() === 'POST',
                {
                    timeout: 30000
                }
            );

        // ==========================================
        // CLICK ONCE
        // ==========================================

        console.log(
            'Clicking Proceed to Pay...'
        );

        await this.proceedToPayButton.click();

        // ==========================================
        // GET PURCHASE API RESPONSE
        // ==========================================

        let purchaseResponse;

        try {

            purchaseResponse =
                await purchaseResponsePromise;

        } catch (error) {

            throw new Error(
                'Purchase API did not respond within 30 seconds.\n' +
                `Current URL: ${this.page.url()}`
            );
        }

        console.log(
            'Purchase API status:',
            purchaseResponse.status()
        );

        // ==========================================
        // VERIFY HTTP STATUS
        // ==========================================

        if (!purchaseResponse.ok()) {

            throw new Error(
                `Purchase API failed. HTTP status: ` +
                `${purchaseResponse.status()}`
            );
        }

        // ==========================================
        // READ API RESPONSE
        // ==========================================

        let purchaseBody;

        try {

            purchaseBody =
                await purchaseResponse.json();

        } catch (error) {

            throw new Error(
                'Purchase API returned successful HTTP status ' +
                'but response was not valid JSON.'
            );
        }

        console.log(
            'Purchase API response:',
            JSON.stringify(purchaseBody)
        );

        // ==========================================
        // VERIFY PURCHASE SUCCESS
        // ==========================================

        if (purchaseBody?.status !== 1) {

            throw new Error(
                'Purchase API returned an unsuccessful response.\n' +
                `Response: ${JSON.stringify(purchaseBody)}`
            );
        }

        if (!purchaseBody?.purchase_id) {

            throw new Error(
                'Purchase API succeeded but purchase_id was not returned.\n' +
                `Response: ${JSON.stringify(purchaseBody)}`
            );
        }

        console.log(
            'Purchase created successfully.'
        );

        console.log(
            'Purchase ID:',
            purchaseBody.purchase_id
        );

        // ==========================================
        // WAIT FOR PAYFAST
        // ==========================================

        /*
         * IMPORTANT:
         *
         * We DO NOT click Proceed to Pay again.
         *
         * The purchase has already been created.
         *
         * We only wait for the frontend to redirect
         * this same tab to PayFast.
         */

        console.log(
            'Waiting for PayFast same-tab navigation...'
        );

        try {

            await expect.poll(
                () => this.page.url(),
                {
                    timeout: 90000,
                    intervals: [
                        500,
                        1000,
                        2000,
                        5000
                    ]
                }
            ).toMatch(
                this.payFastUrl
            );

        } catch (error) {

            throw new Error(
                'Purchase was created successfully, ' +
                'but PayFast redirect did not complete within 90 seconds.\n' +
                `Current URL: ${this.page.url()}`
            );
        }

        // ==========================================
        // VERIFY PAYFAST URL
        // ==========================================

        console.log(
            'PayFast loaded:',
            this.page.url()
        );

        await expect(
            this.page
        ).toHaveURL(
            this.payFastUrl,
            {
                timeout: 15000
            }
        );

        console.log(
            'PayFast successfully loaded in SAME TAB.'
        );

        // ==========================================
        // RETURN PAYFAST PAGE
        // ==========================================

        return this.page;
    }
}

module.exports = {
    PaymentReviewPage
};