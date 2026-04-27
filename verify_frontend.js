import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000');

  // Wait for the app to load
  await page.waitForTimeout(5000);

  // Take screenshot of home page including stats and messages
  await page.screenshot({ path: 'home_leadership_check.png', fullPage: true });

  await browser.close();
  console.log('Screenshots taken');
})();
