import { expect, test } from "@playwright/test";

test("loads the national explorer shell without source data", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      name: "Explore the space between care and transit.",
    }),
  ).toBeVisible();
  await expect(page.getByLabel("Proximity threshold")).toContainText("400");
  await expect(page.getByText("Preview counts are illustrative")).toBeVisible();
});
