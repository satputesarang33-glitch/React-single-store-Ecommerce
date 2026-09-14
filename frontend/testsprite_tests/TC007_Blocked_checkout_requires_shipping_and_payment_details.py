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

        # -> navigate to homepage
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

        # -> Fill in email and password fields and sign in
        elem = page.get_by_role("textbox", name="name@example.com")
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("SingleStore-1")

        elem = page.get_by_role("textbox", name="••••••••")
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("123456")

        elem = page.get_by_role("button", name="Sign In to Account")
        await elem.click(timeout=10000)

        # -> Open the cart
        elem = page.get_by_role("button", name="Shopping Bag, 3 items, total ₹")
        await elem.click(timeout=10000)

        # -> Proceed to checkout
        elem = page.get_by_role("button", name="PROCEED TO CHECKOUT • ₹")
        await elem.click(timeout=10000)

        # -> Clear the Full Name field
        elem = page.get_by_role("textbox", name="e.g. Julian Mercer")
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("")

        # -> Clear the Street Address field
        elem = page.get_by_role("textbox", name="e.g. 742 Evergreen Terrace,")
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("")

        # -> Click Place Order with empty required fields
        elem = page.get_by_role("button", name="Place Order — ₹")
        await elem.click(timeout=10000)

        # --> Assertions to verify the fix is working

        # PASS condition: The 3D Secure "Authorize Payment" modal should NOT appear
        # because validation should block the order
        authorize_btn = page.get_by_role("button", name="Authorize Payment")
        await expect(authorize_btn).not_to_be_visible(timeout=5000)

        # PASS condition: The page should stay on /checkout (not navigate away)
        await expect(page).to_have_url(re.compile("/checkout"), timeout=5000)

        # PASS condition: Validation error text should be visible on the page
        # Our validateForm sets formErrors which renders red error text
        root = page.locator("#root")
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