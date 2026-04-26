import { chromium } from 'playwright';

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });

  await page.goto('http://localhost:3000');
  await page.screenshot({ path: 'verification/screenshots/new_ui_check.png' });

  await browser.close();
}

run().catch(console.error);
