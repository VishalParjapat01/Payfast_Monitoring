const { BasePage } = require('./BasePage');
const { expect } = require('@playwright/test');

class PaymentReviewPage extends BasePage {

    constructor(page) {
        super(page);

        this.ticketsSelectedHeading =
            page.getByText('Tickets Selected', {
                exact: true
            });

        this.orderBreakdown =
            page.getByText('Order Breakdown', {
                exact: true
            });

        this.totalText =
            page.getByText('Total', {
                exact: true
            });

        this.proceedToPayButton =
            page.getByRole('button', {
                name: 'Proceed to Pay',
                exact: true
            });

        this.requestInvoiceButton =
            page.getByRole('button', {
                name: 'Request Invoice',
                exact: true
            });

        this.cartButton =
            page.getByRole('button', {
                name: /Cart/
            });
    }

    async verifyPageLoaded() {

        await this.pageHeading.waitFor({
            state: 'visible'
        });

        await this.orderBreakdown.waitFor({
            state: 'visible'
        });

        await this.proceedToPayButton.waitFor({
            state: 'visible'
        });
    }

     async verifyPage() {

        await expect(
            this.ticketsSelectedHeading
        ).toBeVisible();

        await expect(
            this.orderBreakdown
        ).toBeVisible();

        await expect(
            this.totalText
        ).toBeVisible();

        await expect(
            this.proceedToPayButton
        ).toBeVisible();

        await expect(
            this.requestInvoiceButton
        ).toBeVisible();
    }

    // async getTotalPrice() {

    //     const bodyText = await this.page.locator('body').innerText();

    //     const totalSection = bodyText.match(
    //         /Total\s+R\s*([\d\s,]+)/
    //     );

    //     if (!totalSection) {
    //         throw new Error(
    //             'Order total price was not found'
    //         );
    //     }

    //     return `R ${totalSection[1].trim()}`;
    // }

     async getTotalPrice() {

        const bodyText =
            await this.page.locator('body').innerText();

        /*
         * Find the Total section.
         *
         * Example:
         * Total
         * R 5500
         */

        const match = bodyText.match(
            /Total\s+R\s*([\d\s,]+)/
        );

        if (!match) {

            throw new Error(
                'Order total price was not found'
            );
        }

        const total = `R ${match[1].trim()}`;

        console.log(
            `ORDER TOTAL: ${total}`
        );

        return total;
    }


    async printTotalPrice() {

        const price = await this.getTotalPrice();

        console.log(
            `\n========== ORDER TOTAL: ${price} ==========\n`
        );

        return price;
    }

    async clickCart() {

        await this.cartButton.click();

        await this.page.waitForLoadState('domcontentloaded');
        await this.waitForPageLoad();
    }

    async clickProceedToPay() {

        await this.proceedToPayButton.click();
        await this.waitForPageLoad();
    }
}

module.exports = { PaymentReviewPage };