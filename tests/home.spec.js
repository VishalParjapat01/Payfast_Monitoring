const { test, expect } = require('@playwright/test');
const { HomePage } = require('../pages/HomePage');

test.describe('Mind Matters - Homepage', () => {

    test('Verify website links do not contain creatoro', async ({ page }) => {

        const homePage = new HomePage(page);

        // Open Mind Matters homepage
        await homePage.openHomePage();

        // Verify homepage is loaded
        await expect(page).toHaveTitle(/Mind Matters/i);

        // Get all links from homepage
        const links = await homePage.getLinks();

        console.log(`Total links found: ${links.length}`);

        // Check every link
        for (const link of links) {

            console.log(
                `Link Text: ${link.text} | URL: ${link.href}`
            );

            expect(
                link.href.toLowerCase(),
                `Not Found "creatoro" in URL: ${link.href}`
            ).not.toContain('creatoro');
        }


        // Timestamp at the end of the test
        const timestamp = new Date().toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });

        console.log(`Test completed at: ${timestamp}`);
    });

});