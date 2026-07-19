import { test, expect } from '@playwright/test';

test.describe('FIFA Flow - End-to-End Fan Experience', () => {
  test('User Onboarding, Navigation, Prediction and Stadium Routing', async ({ page }) => {
    // 1. Go to onboarding
    await page.goto('http://localhost:3000/');

    // Assert that the user is on the onboarding setup page
    await expect(page.locator('text=Personalize Your Matchday Experience')).toBeVisible();

    // 2. Select a Seat and Stadium
    const seatInput = page.locator('#seat-input-field');
    await expect(seatInput).toBeVisible();
    await seatInput.fill('112');

    // Submit the profile
    const submitBtn = page.locator('#synthesize-profile-btn');
    await expect(submitBtn).toBeVisible();
    await submitBtn.click();

    // 3. Confirm transition to the Main Fan Dashboard
    await expect(page.locator('text=CONNECTED TO METLIFE SERVER')).toBeVisible();

    // Verify presence of navigation footer tabs
    const homeTab = page.locator('#nav-tab-home');
    const matchTab = page.locator('#nav-tab-match');
    const stadiumTab = page.locator('#nav-tab-stadium');
    const copilotTab = page.locator('#nav-tab-assistant');

    await expect(homeTab).toBeVisible();
    await expect(matchTab).toBeVisible();
    await expect(stadiumTab).toBeVisible();
    await expect(copilotTab).toBeVisible();

    // 4. Test Navigation Flow to Match Center
    await matchTab.click();
    await expect(page.locator('text=Match Center')).toBeVisible();

    // Go to Form & Predictions
    const formTab = page.locator('button:has-text("Form & Prediction")');
    if (await formTab.isVisible()) {
      await formTab.click();
      await expect(page.locator('text=Win Probability Forecast')).toBeVisible();
    }

    // 5. Test Navigation to Stadium Routing Map
    await stadiumTab.click();
    await expect(page.locator('text=Gate Turnstiles Status')).toBeVisible();
    await expect(page.locator('text=Washroom')).toBeVisible();

    // 6. Test AI Copilot Assistant Tab
    await copilotTab.click();
    await expect(page.locator('text=AI Multi-Factor Reasoning Engine')).toBeVisible();

    // Ask a suggested prompt
    const suggestionChip = page.locator('#chat-sug-0'); // "Guide me to my seat"
    if (await suggestionChip.isVisible()) {
      await suggestionChip.click();
      // Verify loader / AI thinking or response is shown
      await expect(page.locator('text=AI Thinking Process Trace')).toBeVisible();
    }
  });
});
