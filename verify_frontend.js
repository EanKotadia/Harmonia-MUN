import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000');

  // Wait for the app to load
  await page.waitForTimeout(5000);

  // Hero Section
  await page.screenshot({ path: 'hero_check.png', fullPage: true });

  await browser.close();
  console.log('Screenshots taken');
})();
