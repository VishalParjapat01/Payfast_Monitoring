const { BasePage } = require('./BasePage');
const { expect } = require('@playwright/test');

class MyTicketsPage extends BasePage {

    constructor(page) {
        super(page);

        // Main page
        this.myTicketsHeading = page.getByRole('heading', {
            name: 'My Tickets'
        });

        this.bookTicketButton = page.getByRole('button', {
            name: 'Book Ticket'
        });

        // Sidebar
        this.myTicketsMenu = page.getByText('My Tickets', {
            exact: true
        });

        this.coursesMenu = page.getByText('Courses', {
            exact: true
        });

        // Summit section
        this.mindMattersSummit = page.getByText(
            'Mind Matters Summit™ 2025',
            { exact: true }
        );

        this.humanGrowthCode = page.getByText(
            'The Human Growth Code',
            { exact: true }
        );

        this.immersiveDomeExperience = page.getByText(
            'The Immersive Dome Experience',
            { exact: true }
        );

        this.immersiveExperiences = page.getByText(
            'Immersive Experiences',
            { exact: true }
        );

        this.preLaunchSigns = page.getByText(
            'Pre-Launch of The Signs by Dr Tara Swart',
            { exact: true }
        );

        this.exclusiveInterviews = page.getByText(
            'Exclusive Interviews',
            { exact: true }
        );

        // Account
        this.myProfile = page.getByText(
            'My Profile',
            { exact: true }
        );

        this.inviteAFriend = page.getByText(
            'Invite a Friend',
            { exact: true }
        );

        this.contactUs = page.getByText(
            'Contact Us',
            { exact: true }
        );

        this.signOut = page.getByText(
            'Sign out',
            { exact: true }
        );

        // Ticket
        this.summitTicket = page.getByText(
            'SUMMIT TICKET',
            { exact: true }
        );

        this.ticketNumber = page.getByText(
            /TICKET NO\.:/
        );

        this.ticketType = page.getByText(
            'Summit Ticket',
            { exact: true }
        );

        this.ticketDate = page.getByText(
            '29 October 2026',
            { exact: true }
        );

        this.ticketVenue = page.getByText(
            'Cape Town International Convention Centre',
            { exact: true }
        );

        this.downloadButton = page.getByRole('button', {
            name: 'DOWNLOAD'
        });

        this.invoiceButton = page.getByRole('button', {
            name: 'INVOICE'
        });
    }

    async waitForDashbordDisplay() {

        await this.myTicketsHeading.waitFor();

        await this.bookTicketButton.waitFor();

        // await this.myTicketsMenu.waitFor();

        // await this.coursesMenu.waitFor();

        await this.myProfile.waitFor();

        await this.inviteAFriend.waitFor();

        await this.contactUs.waitFor();

        await this.signOut.waitFor();
    }

     async verifyDashboardPage() {

        await expect(this.myTicketsHeading).toBeVisible();

        await expect(this.bookTicketButton).toBeVisible();

        await expect(this.myProfile).toBeVisible();

        await expect(this.inviteAFriend).toBeVisible();

        await expect(this.contactUs).toBeVisible();

        await expect(this.signOut).toBeVisible();
    }

    async verifySummitSection() {

        await this.mindMattersSummit.waitFor();

        await this.humanGrowthCode.waitFor();

        await this.immersiveDomeExperience.waitFor();

        await this.immersiveExperiences.waitFor();

        await this.preLaunchSigns.waitFor();

        await this.exclusiveInterviews.waitFor();
    }

    async verifyTicket() {

        await this.summitTicket.waitFor();

        await this.ticketNumber.waitFor();

        await this.ticketType.waitFor();

        await this.ticketDate.waitFor();

        await this.ticketVenue.waitFor();

        await this.downloadButton.waitFor();

        await this.invoiceButton.waitFor();
    }

    async clickBookTicket() {

        await this.bookTicketButton.click();

        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForLoadState('load');
    }
}

module.exports = { MyTicketsPage };