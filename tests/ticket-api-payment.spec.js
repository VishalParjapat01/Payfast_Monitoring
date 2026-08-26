// const { test } = require('@playwright/test');

// const { PaymentReviewPage } = require('../pages/PaymentReviewPage');
// const { PayFastPage } = require('../pages/PayFastPage');
// const { TicketsPage } = require('../pages/TicketsPage');
// const { AddOnsPage } = require('../pages/AddOnsPage');

// const ticketsOrigin = 'https://tickets.mindmatters-summit.com';

// test.describe.configure({ retries: 2 });

// function requiredEnvironment(name) {
//     if (!process.env[name]) {
//         throw new Error(`Missing required environment variable: ${name}`);
//     }
//     return process.env[name];
// }

// function createStorageState(accessToken) {
//     const profile = {
//         user_email: process.env.USER_EMAIL,
//         user_name: process.env.TEST_USER_NAME,
//         company_name: process.env.TEST_COMPANY_NAME,
//         job_title: process.env.TEST_JOB_TITLE,
//         phone: process.env.TEST_PHONE,
//         country: process.env.TEST_COUNTRY,
//         vat_no: process.env.TEST_VAT_NUMBER,
//         medical_reg_no: process.env.TEST_MEDICAL_REG_NUMBER,
//         is_multiply_member: process.env.TEST_IS_MULTIPLY_MEMBER
//     };

//     const localStorage = [
//         {
//             name: 'accessToken',
//             value: accessToken
//         },
//         ...Object.entries(profile)
//             .filter(([, value]) => value)
//             .map(([name, value]) => ({ name, value }))
//     ];

//     return {
//         cookies: [],
//         origins: [
//             {
//                 origin: ticketsOrigin,
//                 localStorage
//             }
//         ]
//     };
// }

// test('Use selected ticket and verify PayFast payment page', async ({ browser }) => {

//     test.setTimeout(120000);
//     const accessToken = requiredEnvironment('TEST_ACCESS_TOKEN');
//     const context = await browser.newContext({
//         storageState: createStorageState(accessToken)
//     });
//     const page = await context.newPage();

//     page.on('framenavigated', frame => {
//         if (frame === page.mainFrame()) {
//             console.log('URL:', frame.url());
//         }
//     });

//     page.on('requestfailed', request => {
//         console.log(
//             'REQUEST FAILED:',
//             request.method(),
//             request.url(),
//             request.failure()?.errorText
//         );
//     });

//     try {
//         await page.goto(`${ticketsOrigin}/summit-2026/tickets`, {
//             waitUntil: 'domcontentloaded'
//         });

//         const ticketsPage = new TicketsPage(page);
//         await ticketsPage.verifyPageLoaded();
//         await ticketsPage.selectSummitTicketIfNeeded();
//         await ticketsPage.clickProceed();

//         const addOnsPage = new AddOnsPage(page);
//         await addOnsPage.verifyPageLoaded();
//         await addOnsPage.clickProceed();

//         const paymentPage = new PaymentReviewPage(page);


//         await paymentPage.verifyPage();

//         const payFastTab = await paymentPage.clickProceedToPay();

//         const payFastPage = new PayFastPage(payFastTab);
//         await payFastPage.verifyPage();
//         await payFastPage.fillContactInformation(
//             requiredEnvironment('USER_EMAIL')
//         );
//         await payFastPage.getPaymentAmount();
//     } finally {
//         await context.close();
//     }
// });



const { test } = require('@playwright/test');

const { PaymentReviewPage } =
    require('../pages/PaymentReviewPage');

const { PayFastPage } =
    require('../pages/PayFastPage');

const { TicketsPage } =
    require('../pages/TicketsPage');

const { AddOnsPage } =
    require('../pages/AddOnsPage');


const ticketsOrigin =
    'https://tickets.mindmatters-summit.com';


function requiredEnvironment(name) {

    if (!process.env[name]) {

        throw new Error(
            `Missing required environment variable: ${name}`
        );
    }

    return process.env[name];
}


function createStorageState(accessToken) {

    const profile = {

        user_email:
            process.env.USER_EMAIL,

        user_name:
            process.env.TEST_USER_NAME,

        company_name:
            process.env.TEST_COMPANY_NAME,

        job_title:
            process.env.TEST_JOB_TITLE,

        phone:
            process.env.TEST_PHONE,

        country:
            process.env.TEST_COUNTRY,

        vat_no:
            process.env.TEST_VAT_NUMBER,

        medical_reg_no:
            process.env.TEST_MEDICAL_REG_NUMBER,

        is_multiply_member:
            process.env.TEST_IS_MULTIPLY_MEMBER
    };


    const localStorage = [

        {
            name: 'accessToken',
            value: accessToken
        },

        ...Object.entries(profile)
            .filter(([, value]) => value)
            .map(
                ([name, value]) => ({
                    name,
                    value
                })
            )
    ];


    return {

        cookies: [],

        origins: [

            {
                origin: ticketsOrigin,

                localStorage
            }

        ]
    };
}


test(
    'Use selected ticket and verify PayFast payment page',
    async ({ browser }) => {

        /*
         * Payment gateway can take some time to redirect.
         */
        test.setTimeout(180000);


        // ==========================================
        // CREATE CONTEXT
        // ==========================================

        const accessToken =
            requiredEnvironment(
                'TEST_ACCESS_TOKEN'
            );


        const context =
            await browser.newContext({

                storageState:
                    createStorageState(
                        accessToken
                    )
            });


        const page =
            await context.newPage();


        // ==========================================
        // DEBUG NAVIGATION
        // ==========================================

        // const page = await context.newPage();

        // ==========================================
        // DEBUG NAVIGATION
        // ==========================================

        page.on('framenavigated', frame => {
            if (frame === page.mainFrame()) {
                console.log('URL:', frame.url());
            }
        });

        // ==========================================
        // DEBUG FAILED REQUESTS
        // ==========================================

        page.on('requestfailed', request => {

            const url = request.url();

            const ignoredHosts = [
                'analytics.google.com',
                'px.ads.linkedin.com',
                'google-analytics.com'
            ];

            const shouldIgnore =
                ignoredHosts.some(host =>
                    url.includes(host)
                );

            if (shouldIgnore) {
                return;
            }

            console.log(
                'REQUEST FAILED:',
                request.method(),
                url,
                request.failure()?.errorText
            );
        });


        try {

            // ==========================================
            // STEP 1
            // TICKETS
            // ==========================================

            console.log(
                '\n========================================'
            );

            console.log(
                'STEP 1 - TICKETS'
            );

            console.log(
                '========================================'
            );


            await page.goto(
                `${ticketsOrigin}/summit-2026/tickets`,
                {
                    waitUntil: 'domcontentloaded',
                    timeout: 60000
                }
            );


            const ticketsPage =
                new TicketsPage(page);


            await ticketsPage.verifyPageLoaded();


            /*
             * If Summit Ticket is already selected,
             * this method should leave it selected.
             *
             * If it is not selected,
             * this method should select it.
             */
            await ticketsPage.selectSummitTicketIfNeeded();


            /*
             * Move to Add-ons.
             */
            await ticketsPage.clickProceed();


            // ==========================================
            // STEP 2
            // ADD-ONS
            // ==========================================

            console.log(
                '\n========================================'
            );

            console.log(
                'STEP 2 - ADD-ONS'
            );

            console.log(
                '========================================'
            );


            const addOnsPage =
                new AddOnsPage(page);


            await addOnsPage.verifyPageLoaded();


            /*
             * We intentionally DO NOT select:
             *
             * Immersive Experience
             */
            await addOnsPage.clickProceed();


            // ==========================================
            // STEP 3 - PAYMENT REVIEW
            // ==========================================

            console.log(
                '\n========================================'
            );

            console.log(
                'STEP 3 - PAYMENT REVIEW'
            );

            console.log(
                '========================================'
            );

            const paymentPage =
                new PaymentReviewPage(page);

            await paymentPage.verifyPageLoaded();

            await paymentPage.verifyPage();


            // ==========================================
            // STEP 4 - PROCEED TO PAY
            // ==========================================

            console.log(
                '\n========================================'
            );

            console.log(
                'STEP 4 - PROCEED TO PAY'
            );

            console.log(
                '========================================'
            );

            const payFastPageObject =
                await paymentPage.clickProceedToPay();


            // ==========================================
            // STEP 5 - PAYFAST
            // ==========================================

            console.log(
                '\n========================================'
            );

            console.log(
                'STEP 5 - PAYFAST'
            );

            console.log(
                '========================================'
            );

            const payFastPage =
                new PayFastPage(
                    payFastPageObject
                );

            await payFastPage.verifyPage();

            await payFastPage.fillContactInformation(
                requiredEnvironment('USER_EMAIL')
            );

            await payFastPage.getPaymentAmount();


            // ==========================================
            // SUCCESS
            // ==========================================

            console.log(
                '\n========================================'
            );

            console.log(
                'TEST PASSED'
            );

            console.log(
                'PAYFAST PAGE IS WORKING'
            );

            console.log(
                '========================================\n'
            );

        } finally {

            await context.close();
        }
    }
);
