# Payment monitor

The monitor runs the existing ticket-booking test through the PayFast page. It stores the last result in `.payment-monitor-state.json`.

## Local or server setup

Copy the values below into the server's environment or a local `.env` file. Do not commit credentials.

```text
BASE_URL=https://your-site.example
USER_EMAIL=monitor-user@example.com
USER_PASSWORD=your-password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=monitor-user@example.com
SMTP_PASSWORD=your-app-password
ALERT_FROM=monitor-user@example.com
ALERT_TO=your-team@example.com
```

Gmail SMTP with an app password is one free option. The mailbox must have two-step verification enabled. Other SMTP providers work with the same variables. The existing Playwright configuration uses a headed browser for this gateway, so on a Linux server run the command through `xvfb-run`.

Install dependencies and browsers once:

```text
npm ci
npx playwright install chromium
```

Run a one-shot check with `npm run monitor:payment`.

## Test alert emails safely

This does not change the real website. In PowerShell, force a simulated outage:

```powershell
$env:MONITOR_TEST_MODE="true"; $env:SIMULATE_FAILURE="true"; npm run monitor:payment
```

The command should exit with code `1` and send one incident email to all recipients. Run it a second time; it should send no second incident email because the saved state is already down.

Then clear the simulation and run the real check to trigger the recovery email:

```powershell
$env:MONITOR_TEST_MODE="false"; $env:SIMULATE_FAILURE="false"; npm run monitor:payment
```

It should exit with code `0` and send one recovery email. Close the PowerShell window afterward, or clear the variables with `Remove-Item Env:MONITOR_TEST_MODE,Env:SIMULATE_FAILURE` so the simulation cannot affect future commands.

## Every two hours on a server

Use the server's scheduler, for example Linux cron:

```text
0 */2 * * * cd /path/to/MindMattersAutomation && xvfb-run --auto-servernum npm run monitor:payment >> /var/log/payment-monitor.log 2>&1
```

The first failed check sends an incident email. Further failures send nothing while the status remains down. The first successful check after a failure sends a recovery email. A successful check sends no email when the previous check was also successful.

## GitHub Actions option

The included workflow runs every two hours and can be started manually from the Actions tab. Add the variables as repository Actions secrets using the names in the workflow. GitHub-hosted runners are free within GitHub's included usage limits.

The workflow uses GitHub Actions cache to carry the state file between runs, so failure deduplication and recovery notifications continue to work across temporary runners. A persistent server cron remains an alternative if you already have a server.