import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 2000 });
  await page.goto('http://localhost:3000');

  // Wait for the app to load
  await page.waitForTimeout(5000);

  // Navigate to About
  const aboutButton = page.locator('button:has-text("About")').first();
  await aboutButton.click();
  await page.waitForTimeout(2000);

  // Screenshot the new About page
  await page.screenshot({ path: 'about_redesign_check.png', fullPage: true });

  await browser.close();
  console.log('Screenshots taken');
})();
