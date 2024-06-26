import { expect, test } from "@playwright/test";
import { AuthPageObject } from "../testObjectModels/authPageModel";
import { baseURL } from "./url";

test.describe("Auth", () => {
  let authPage: AuthPageObject;
  const email = "test@test.test";
  const password = "123456";

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPageObject(page);
    await authPage.open();
  });

  test("unauthorized user", async () => {
    const page = authPage.getPage();
    await test.step("go to protected page should be redirected to auth page", async () => {
      await page.goto(`${baseURL}calendar`);
      await page.waitForURL(`${baseURL}auth/signin`);
      expect(page.url()).toBe(`${baseURL}auth/signin`);
    });
    await test.step("signin", async () => {
      await authPage.open();
      await authPage.fillEmail(email);
      await authPage.fillPassword(password);
      await authPage.submitSignIn();
    });
    await test.step("after authorization should be redirected back on protected path", async () => {
      await page.waitForURL(`${baseURL}calendar`);
      expect(page.url()).toBe(`${baseURL}calendar`);
    });
  });
});
