class BasePage {

    constructor(page) {
        this.page = page;
    }

    async open(path = '/') {

        await this.page.goto(path, {
            waitUntil: 'domcontentloaded'
        });

        // await this.page.waitForLoadState('load');
    }

    async waitForPageLoad() {

        await this.page.waitForLoadState('domcontentloaded');

        await this.page.waitForLoadState('load');
    }


    async getAllLinks() {

        return await this.page.locator('a').evaluateAll(links =>
            links.map(link => ({
                text: link.innerText.trim(),
                href: link.href
            }))
        );
    }

}

module.exports = { BasePage };