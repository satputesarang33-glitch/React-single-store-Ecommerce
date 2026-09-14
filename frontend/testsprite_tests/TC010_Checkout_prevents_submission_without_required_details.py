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
        context.set_default_timeout(15000)

        # Open a new page in the browser context
        page = await context.new_page()

        # -> Navigate to homepage
        await page.goto("http://localhost:3005")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass

        # -> Open the Login page
        await page.goto("http://localhost:3005/login")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass

        # -> Fill in email and password and sign in
        elem = page.get_by_role("textbox", name="name@example.com")
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("SingleStore-1")

        elem = page.get_by_role("textbox", name="••••••••")
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("123456")

        elem = page.get_by_role("button", name="Sign In to Account")
        await elem.click(timeout=10000)

        # -> Navigate directly to checkout
        await page.goto("http://localhost:3005/checkout")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass

        # -> Clear the Full Name field
        elem = page.get_by_role("textbox", name="e.g. Julian Mercer")
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("")

        # -> Clear the Street Address field
        elem = page.get_by_role("textbox", name="e.g. 742 Evergreen Terrace,")
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("")

        # -> Clear the City field
        elem = page.get_by_role("textbox", name="e.g. Brooklyn")
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("")

        # -> Clear the Pincode field
        elem = page.get_by_role("textbox", name="e.g. 11201 or")
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("")

        # -> Click Place Order with empty required fields
        elem = page.get_by_role("button", name="Place Order — ₹")
        await elem.click(timeout=10000)

        # --> Assertions to verify the fix is working

        # PASS: Page must remain on /checkout (not navigate away to order success)
        await expect(page).to_have_url(re.compile("/checkout"), timeout=5000)

        # PASS: "ORDER PLACED SUCCESSFULLY" must NOT appear - order is blocked
        root = page.locator("#root")
        await expect(root).not_to_contain_text("ORDER PLACED SUCCESSFULLY", timeout=5000)

        # PASS: "View Order Details" button must NOT be visible
        view_order_btn = page.get_by_role("button", name="View Order Details")
        await expect(view_order_btn).not_to_be_visible(timeout=5000)

        # PASS: Validation error text should be visible indicating blocked submission
        await expect(root).to_contain_text("required", timeout=5000)

        await asyncio.sleep(3)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())