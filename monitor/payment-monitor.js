const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');
const { promisify } = require('util');
const nodemailer = require('nodemailer');
const { chromium } = require('playwright');

const { HomePage } = require('../pages/HomePage');
const { SignInPage } = require('../pages/SignInPage');
const { MyTicketsPage } = require('../pages/MyTicketsPage');
const { TicketsPage } = require('../pages/TicketsPage');
const { AddOnsPage } = require('../pages/AddOnsPage');
const { PaymentReviewPage } = require('../pages/PaymentReviewPage');
const { PayFastPage } = require('../pages/PayFastPage');

require('dotenv').config();

const stateFile = path.resolve(
    process.env.MONITOR_STATE_FILE || '.payment-monitor-state.json'
);
const execFileAsync = promisify(execFile);

function readState() {
    try {
        return JSON.parse(fs.readFileSync(stateFile, 'utf8'));
    } catch (error) {
        return { status: 'unknown' };
    }
}

function writeState(status, details) {
    const temporaryFile = `${stateFile}.tmp`;
    fs.writeFileSync(temporaryFile, JSON.stringify({
        status,
        checkedAt: new Date().toISOString(),
        details
    }, null, 2));
    fs.renameSync(temporaryFile, stateFile);
}

function clearState() {
    fs.rmSync(stateFile, { force: true });
    fs.rmSync(`${stateFile}.tmp`, { force: true });
}

function requiredEnvironment(name) {
    if (!process.env[name]) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return process.env[name];
}

async function verifyPaymentPage() {
    const browser = await chromium.launch({
        headless: process.env.HEADLESS !== 'false'
    });
    const context = await browser.newContext({
        baseURL: requiredEnvironment('BASE_URL'),
        viewport: {
            width: 1280,
            height: 720
        }
    });
    const page = await context.newPage();

    try {
        const homePage = new HomePage(page);
        await homePage.openHomePage();

        const signInTab = await homePage.clickSignIn();
        const signInPage = new SignInPage(signInTab);
        await signInPage.verifyLoginPageLoaded();
        await signInPage.login(
            requiredEnvironment('USER_EMAIL'),
            requiredEnvironment('USER_PASSWORD')
        );

        const myTicketsPage = new MyTicketsPage(signInTab);
        await myTicketsPage.waitForDashbordDisplay();
        await myTicketsPage.clickBookTicket();

        const ticketsPage = new TicketsPage(signInTab);
        await ticketsPage.verifyPageLoaded();
        await ticketsPage.selectSummitTicket();
        await ticketsPage.clickProceed();

        const addOnsPage = new AddOnsPage(signInTab);
        await addOnsPage.verifyPage();
        await addOnsPage.clickProceed();

        const paymentPage = new PaymentReviewPage(signInTab);
        await paymentPage.verifyPage();
        const payFastTab = await paymentPage.clickProceedToPay();

        const payFastPage = new PayFastPage(payFastTab);
        await payFastPage.paymentTotalLabel.waitFor({
            state: 'visible',
            timeout: 15000
        });
        await payFastPage.verifyPage();
        const amount = await payFastPage.getPaymentAmount();

        return { url: signInTab.url(), amount };
    } finally {
        await browser.close();
    }
}

async function runPaymentTest() {
    if (
        process.env.MONITOR_TEST_MODE === 'true' &&
        process.env.SIMULATE_FAILURE === 'true'
    ) {
        throw new Error('Simulated payment gateway failure for alert testing');
    }

    const command = process.platform === 'win32' ? 'npx.cmd' : 'npx';

    try {
        const result = await execFileAsync(command, [
            'playwright',
            'test',
            'tests/ticket-api-payment.spec.js',
            '--project=chromium',
            '--reporter=line'
        ], {
            cwd: path.resolve(__dirname, '..'),
            env: process.env,
            maxBuffer: 10 * 1024 * 1024,
            shell: process.platform === 'win32'
        });

        return {
            url: process.env.BASE_URL,
            output: result.stdout.trim()
        };
    } catch (error) {
        const output = [error.stdout, error.stderr]
            .filter(Boolean)
            .join('\n')
            .trim();

        throw new Error(output || error.message);
    }
}

function createTransport() {
    return nodemailer.createTransport({
        host: requiredEnvironment('SMTP_HOST'),
        port: Number(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: requiredEnvironment('SMTP_USER'),
            pass: requiredEnvironment('SMTP_PASSWORD')
        }
    });
}

async function sendEmail(subject, text) {
    if (process.env.MONITOR_EMAIL_ENABLED === 'false') {
        console.log(`Email disabled: ${subject}`);
        return;
    }

    try {
        const transport = createTransport();
        await transport.verify();
        await transport.sendMail({
            from: requiredEnvironment('ALERT_FROM'),
            to: requiredEnvironment('ALERT_TO'),
            subject,
            text
        });
        console.log(`Alert email accepted by SMTP for: ${process.env.ALERT_TO}`);
    } catch (error) {
        console.error(`Unable to send alert email: ${error.message}`);
        throw error;
    }
}

async function main() {
    const previousState = readState();

    try {
        const result = await runPaymentTest();
        writeState('up', result);
        console.log(`Payment page is UP: ${result.url}`);

        if (previousState.status === 'down') {
            await sendEmail(
                'Mind Matters payment gateway recovered',
                `Everything is good now. The PayFast payment page is available again.\n\nChecked: ${new Date().toISOString()}\nURL: ${result.url}\nAmount: ${result.amount}`
            );
        }
    } catch (error) {
        const details = error instanceof Error ? error.stack || error.message : String(error);
        writeState('down', { error: details });
        console.error(`Payment page is DOWN: ${details}`);

        if (previousState.status !== 'down') {
            await sendEmail(
                'ACTION REQUIRED: Mind Matters payment gateway is unavailable',
                `The PayFast payment page check failed. Please investigate the payment gateway/server.\n\nChecked: ${new Date().toISOString()}\n\n${details}`
            );
        }

        process.exitCode = 1;
    } finally {
        clearState();
        console.log(`Cleared monitor cache: ${stateFile}`);
    }
}

main().catch(error => {
    console.error(error);
    process.exitCode = 1;
});