// class HomePage {
//     constructor(page) {

//         //Navebar menu links
//         this.page = page;
//         this.HomeLink = page.locator('a[href="#home"]');
//         this.OurCompanyLink = page.getByRole('link', { name: 'Our Company' });
//         this.AboutLink = page.getByRole('link', { name: 'About' });
//         this.SpeakersLink = page.getByRole('link', { name: 'Speakers' });
//         this.ImmersiveExperienceLink = page.getByRole('link', { name: 'Immersive Experience' });
//         this.TicketsLink = page.getByRole('link', { name: 'Tickets' });
//         this.PastEventsLink = page.getByRole('link', { name: 'Past Events' }).first();
//         this.BlogLink = page.getByRole('link', { name: 'Blog' });
//         this.SignInLink = page.getByRole('link', { name: 'Sign In' }).first();


//         //Section headers
//         this.AboutSectionHeader = page.getByRole('heading', { name: 'About Mind Matters Summit' });
//         this.SpeakersSectionHeader = page.Role('heading', { name: 'Our Hosts' });
//         this.ImmersiveExperienceSectionHeader = page.getByRole('heading', { name: 'Immersive Experience' });
//         this.TicketsLink = page.getByRole('heading', { name: 'Tickets' });

//     }

//     async checkNvabarLinks() {
//         await page.waitForLoadState('networkidle');

//         const [newPage] = await Promise.all([
//             this.page.context().waitForEvent('page'),
//             this.OurCompanyLink.click(),
//         ]);

//         await page.waitForLoadState('networkidle');

//         await expect(page).toHaveURL('https://company.mindmatters-summit.com');
//         await newPage.close();

//         await expect(page).toHaveURL('https://mindmatters-summit.com/');

//         await page.waitForLoadState('networkidle');

//         await this.AboutLink.click();
//         await expect(page).AboutLink.toBeVisible();
//         await this.page.evaluate(() => {
//             window.scrollBy(0, -150);
//         });
//         await this.page.waitForTimeout(500);


//     }


// }

const { BasePage } = require('./BasePage');

class HomePage extends BasePage {

    constructor(page) {
        super(page);

        this.signInButton = page.getByRole('link', {
            name: 'Sign In'
        });

        this.ourCompanyLink = page.getByRole('link', {
            name: 'Our Company'
        });

        this.aboutLink = page.getByRole('link', {
            name: 'About'
        });

        this.speakersLink = page.getByRole('link', {
            name: 'Speakers'
        });

        this.immersiveExperienceLink = page.getByRole('link', {
            name: 'Immersive Experience'
        });

        this.ticketsLink = page.getByRole('link', {
            name: 'Tickets'
        });

        this.pastEventsLink = page.getByRole('link', {
            name: /Past Events/
        });

        this.blogLink = page.getByRole('link', {
            name: 'Blog'
        });

        this.bookTicketLink = page.getByRole('link', {
            name: 'Book Ticket',
            exact: true
        });
    }

    async openHomePage() {
        await this.open('/');
    }

    async getLinks() {
        return await this.getAllLinks();
    }

    async clickSignIn() {

        const newPagePromise = this.page.waitForEvent('popup');

        await this.signInButton.click();

        const newPage = await newPagePromise;

        // await newPage.waitForLoadState('load');

        return newPage;
    }
}

module.exports = { HomePage };