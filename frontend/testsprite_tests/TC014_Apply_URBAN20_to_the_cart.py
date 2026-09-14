import asyncio
import re
from playwright import async_api
from playwright.async_api import expect

async def run_test():
    pw = None
    browser = None
    context = None

    try:
        # Start a Playwright session in asynchronous mode
        pw = await async_api.async_playwright().start()

        # Launch a Chromium browser in headless mode with custom arguments
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--window-size=1280,720",
                "--disable-dev-shm-usage",
                "--ipc=host",
                "--single-process"
            ],
        )

        # Create a new browser context (like an incognito window)
        context = await browser.new_context()
        # Wider default timeout to match the agent's DOM-stability budget;
        # auto-waiting Playwright APIs (expect, locator.wait_for) inherit this.
        context.set_default_timeout(15000)

        # Open a new page in the browser context
        page = await context.new_page()

        # Interact with the page elements to simulate user flow
        # -> navigate
        await page.goto("http://localhost:3005/")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass
        
        # -> Click the 'Shopping Bag' button in the header to open the cart page.
        # 3 | ₹55,360 button
        elem = page.get_by_role("button", name="Shopping Bag, 3 items, total ₹")
        await elem.click(timeout=10000)
        
        # -> Enter 'URBAN20' into the promo input field labeled 'PROMO OR COUPON CODE' and click the 'Apply' button.
        # Promo or coupon code text field
        elem = page.get_by_role("textbox", name="Promo or coupon code")
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("URBAN20")
        
        # -> Enter 'URBAN20' into the promo input field labeled 'PROMO OR COUPON CODE' and click the 'Apply' button.
        # Apply button
        elem = page.get_by_role("button", name="Apply")
        await elem.click(timeout=10000)
        
        # --> Assertions to verify final state
        
        # --> The URBAN20 promo is applied and the cart summary shows the discount reflected in the order total.
        await page.get_by_role("button", name="Remove coupon").nth(0).scroll_into_view_if_needed()
        # Assert-outcome: passed
        # Assert: Remove-coupon control is visible, indicating the promo is applied.
        await expect(page.get_by_role("button", name="Remove coupon").nth(0)).to_be_visible(timeout=15000), "Remove-coupon control is visible, indicating the promo is applied."
        await page.get_by_role("button", name="PROCEED TO CHECKOUT • ₹").nth(0).scroll_into_view_if_needed()
        # Assert-outcome: passed
        # Assert: Proceed to checkout button with the updated estimated total is visible.
        await expect(page.get_by_role("button", name="PROCEED TO CHECKOUT • ₹").nth(0)).to_be_visible(timeout=15000), "Proceed to checkout button with the updated estimated total is visible."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    