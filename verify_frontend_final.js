import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(5000);

  // Take screenshot of Homepage
  await page.screenshot({ path: 'home_final_check.png', fullPage: true });

  await browser.close();
  console.log('Screenshots taken');
})();
