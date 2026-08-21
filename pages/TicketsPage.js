const { BasePage } = require('./BasePage');
const { expect } = require('@playwright/test');

class TicketsPage extends BasePage {

    constructor(page) {
        super(page);

        this.pageHeading = page.getByRole('heading', {
            name: 'Select Your Experience',
            exact: true
        });

        this.summitTicketText = page.getByText(
            'Summit Ticket',
            { exact: true }
        );

        this.selectButtons = page.getByRole('button', {
            name: 'Select',
            exact: true
        });

        this.proceedButton = page.getByRole('button', {
            name: 'Proceed',
            exact: true
        });
    }

    async verifyPage() {

        await expect(this.pageHeading).toBeVisible();

        await expect(this.summitTicketText).toBeVisible();
    }

    async verifyPageLoaded() {

        await this.pageHeading.waitFor({
            state: 'visible'
        });

        await this.summitTicketText.first().waitFor({
            state: 'visible'
        });
    }

    async selectSummitTicket() {

        const ticket = this.page.locator('div').filter({
            hasText: 'Summit Ticket'
        }).filter({
            has: this.page.getByRole('button', {
                name: 'Select',
                exact: true
            })
        }).first();

        await ticket.getByRole('button', {
            name: 'Select',
            exact: true
        }).first().click();
    }

    // async getSummitTicketPrice() {

    //     const ticket = this.page.locator('div').filter({
    //         hasText: 'Summit Ticket'
    //     }).first();

    //     const text = await ticket.innerText();

    //     const price = text.match(/R\s*[\d\s,]+/);

    //     if (!price) {
    //         throw new Error(
    //             'Unable to find Summit Ticket price'
    //         );
    //     }

    //     return price[0].trim();
    // }

    async getSummitTicketPrice() {

        /*
         * We find the Summit Ticket card
         * and read its text.
         *
         * We DON'T hardcode R 5500.
         */

        const ticketCard = this.page.locator('div').filter({
            hasText: 'Summit Ticket'
        }).filter({
            has: this.page.getByRole('button', {
                name: 'Select',
                exact: true
            })
        }).first();

        const cardText = await ticketCard.innerText();

        const priceMatch =
            cardText.match(/R\s*[\d\s,]+/);

        if (!priceMatch) {

            throw new Error(
                'Summit Ticket price was not found'
            );
        }

        const price = priceMatch[0].trim();

        console.log(
            `SUMMIT TICKET PRICE: ${price}`
        );

        return price;
    }

    async clickProceed() {
        await this.proceedButton.click();
        await this.waitForPageLoad();
    }
}

module.exports = { TicketsPage };