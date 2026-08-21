const { BasePage } = require('./BasePage');
const { expect } = require('@playwright/test');

class AddOnsPage extends BasePage {

    constructor(page) {
        super(page);

        this.pageHeading = page.getByRole('heading', {
            name: 'Customize Your Experience',
            exact: true
        });

        this.immersiveExperience = page.getByText(
            'Immersive Experience',
            { exact: true }
        );

        this.proceedButton = page.getByRole('button', {
            name: 'Proceed',
            exact: true
        });
    }

    async verifyPageLoaded() {

        await this.pageHeading.waitFor({
            state: 'visible'
        });

        await this.immersiveExperience.waitFor({
            state: 'visible'
        });

        await this.proceedButton.waitFor({
            state: 'visible'
        });
    }

      async verifyPage() {

        await expect(this.pageHeading).toBeVisible();

        await expect(
            this.immersiveExperience
        ).toBeVisible();

        await expect(
            this.proceedButton
        ).toBeVisible();
    
    }
    
    async clickProceed() {

        // We intentionally do NOT select
        // the Immersive Experience add-on.

        await this.proceedButton.click();
        await this.waitForPageLoad();
    }
}

module.exports = { AddOnsPage };