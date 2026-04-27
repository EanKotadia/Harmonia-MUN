import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 5000 });
  await page.goto('http://localhost:3000');

  // Wait for the app to load
  await page.waitForTimeout(5000);

  // Check if home sections are visible
  const texts = ['The Councils', 'Timeline', 'Moments', 'Global Partners'];
  for (const text of texts) {
      const visible = await page.isVisible(`text=${text}`);
      console.log(`${text} visible: ${visible}`);
  }

  // Take screenshot
  await page.screenshot({ path: 'home_extended_v2.png' });

  await browser.close();
  console.log('Screenshots taken');
})();
