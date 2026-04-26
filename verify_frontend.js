import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000');

  // Wait for the app to load
  await page.waitForTimeout(5000);

  // Hero Section
  await page.screenshot({ path: 'hero_check_v2.png', fullPage: true });

  // Try to go to about section (which now has gallery and sponsors)
  const aboutButton = page.locator('button:has-text("About")').first();
  if (await aboutButton.isVisible()) {
      await aboutButton.click();
      await page.waitForTimeout(2000);
      await page.screenshot({ path: 'about_merged_check.png', fullPage: true });
  }

  // Try to go to committees section
  const commButton = page.locator('button:has-text("Committees")').first();
  if (await commButton.isVisible()) {
      await commButton.click();
      await page.waitForTimeout(2000);
      await page.screenshot({ path: 'committees_check.png', fullPage: true });

      // Expand first committee
      const firstCard = page.locator('h3').first();
      if (await firstCard.isVisible()) {
          await firstCard.click();
          await page.waitForTimeout(2000);
          await page.screenshot({ path: 'committee_expanded_check.png' });
      }
  }

  await browser.close();
  console.log('Screenshots taken');
})();
