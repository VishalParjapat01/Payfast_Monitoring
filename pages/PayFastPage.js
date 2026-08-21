const { BasePage } = require('./BasePage');
const { expect } = require('@playwright/test');

class PayFastPage extends BasePage {

    constructor(page) {
        super(page);

        this.paymentTotalLabel = page
            .locator('#process-payment-info-table')
            .getByText('Payment total:', {
                exact: true
            });

        this.howCanText = page.locator(
            '#change-user-box .buyer-change-title'
        );

        this.contactInput = page.locator(
            '#change-username'
        );

        this.continueButton = page.locator(
            '#validateme'
        );

        this.cancelTransactionButton = page.locator(
            '#cancel-transaction-btn'
        );
    }

    async verifyPage() {

        await expect(
            this.paymentTotalLabel
        ).toBeVisible();

        await expect(
            this.howCanText
        ).toBeVisible();

        await expect(
            this.contactInput
        ).toBeVisible();

        await expect(
            this.continueButton
        ).toBeVisible();

        await expect(
            this.cancelTransactionButton
        ).toBeVisible();
    }

    async getPaymentAmount() {

        const bodyText =
            await this.page.locator('body').innerText();

        const match = bodyText.match(
            /(?:INR|ZAR|USD|EUR)\s*[₹$€£]?\s*[\d,]+(?:\.\d+)?/
        );

        if (!match) {

            throw new Error(
                'PayFast payment amount was not found'
            );
        }

        const amount = match[0].trim();

        console.log(
            `PAYFAST PAYMENT AMOUNT: ${amount}`
        );

        return amount;
    }
}

module.exports = { PayFastPage };