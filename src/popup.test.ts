import path from "path";

import { Browser, launch, Page } from "puppeteer";

describe("Extension", () => {
  let ex: Page;
  let browser: Browser;

  beforeAll(async () => {
    const extensionPath = path.join(path.resolve(), "/build/chrome-mv3-prod"); // For instance, 'dist'

    browser = await launch({
      headless: false, // extension are allowed only in the head-full mode
      args: [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`],
    });

    await new Promise((r) => {
      setTimeout(r, 2000);
    });

    // Find the extension id
    const targets = browser.targets();
    const extensionTarget = targets.find((target) => target.type() === "service_worker");
    const partialExtensionUrl = extensionTarget?.url() || "";
    const [, , extensionId] = partialExtensionUrl.split("/");

    // Open the extension in a new page
    ex = await browser.newPage();
    ex.goto(`chrome-extension://${extensionId}/popup.html`, {
      waitUntil: ["domcontentloaded", "networkidle2"],
    });
  });

  afterAll(() => {
    browser.close();
  });

  it("should load the extension index page", async () => {
    const element = await ex.waitForSelector('[data-testid="welcome-message"]');
    const value = await element?.evaluate((el) => el.textContent);

    expect(value).toEqual("Share your knowledge, skills and passion to get your just rewards!");
  });
});
