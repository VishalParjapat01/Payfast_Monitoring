const { BasePage } = require('./BasePage');
const { expect } = require('@playwright/test');

class SignInPage extends BasePage {

    constructor(page) {
        super(page);

        this.emailInput = page.getByPlaceholder('Enter your email');

        this.passwordInput = page.getByPlaceholder('••••••••');

        this.signInButton = page.getByRole('button', {
            name: 'Sign in'
        });

        this.forgotPasswordLink = page.getByText('Forgot password');

        this.createAccountLink = page.getByText('Create account');

        this.backButton = page.getByRole('button', {
            name: 'Back'
        });
    }

    async login(email, password) {

        await this.emailInput.fill(email);

        await this.passwordInput.fill(password);

        await this.signInButton.click();
    }

    async verifyLoginPageLoaded() {

        await this.emailInput.waitFor();

        await this.passwordInput.waitFor();

        await this.signInButton.waitFor();
    }

     async verifyLoginPage() {

        await expect(this.emailInput).toBeVisible();

        await expect(this.passwordInput).toBeVisible();

        await expect(this.signInButton).toBeVisible();
    }
}

module.exports = { SignInPage };