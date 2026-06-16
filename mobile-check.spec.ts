import { test, chromium } from "@playwright/test";

const widths = [320, 360, 390, 430];
const routes = ["/", "/categories", "/offers", "/cart", "/checkout"];

test("mobile storefront has no horizontal overflow", async () => {
  test.setTimeout(90_000);
  const browser = await chromium.launch({ channel: "chrome" });

  for (const width of widths) {
    const page = await browser.newPage({
      viewport: { width, height: 900 },
      isMobile: true,
      deviceScaleFactor: 2,
    });

    for (const route of routes) {
      await page.goto(`http://localhost:3000${route}`, { waitUntil: "networkidle" });
      const metrics = await page.evaluate(() => {
        const root = document.documentElement;
        const body = document.body;
        const offenders = Array.from(document.querySelectorAll("*"))
          .map((element) => {
            const rect = element.getBoundingClientRect();
            return {
              tag: element.tagName,
              className:
                typeof element.className === "string" ? element.className.slice(0, 120) : "",
              left: Math.round(rect.left),
              right: Math.round(rect.right),
              text: (element.textContent || "").trim().replace(/\s+/g, " ").slice(0, 80),
            };
          })
          .filter((item) => item.left < -1 || item.right > window.innerWidth + 1)
          .slice(0, 5);

        return {
          clientWidth: root.clientWidth,
          scrollWidth: Math.max(root.scrollWidth, body.scrollWidth),
          headerHeight: Math.round(document.querySelector("header")?.getBoundingClientRect().height || 0),
          firstSectionHeight: Math.round(document.querySelector("main section")?.getBoundingClientRect().height || 0),
          offenders,
        };
      });

      console.log(
        JSON.stringify({
          width,
          route,
          overflow: metrics.scrollWidth - metrics.clientWidth,
          headerHeight: metrics.headerHeight,
          firstSectionHeight: metrics.firstSectionHeight,
          offenders: metrics.offenders,
        }),
      );

      if (metrics.scrollWidth > metrics.clientWidth + 1 || metrics.offenders.length > 0) {
        throw new Error(`${route} overflows at ${width}px`);
      }
    }

    if (width === 320 || width === 390 || width === 430) {
      await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
      await page.screenshot({ path: `.mobile-checks/home-${width}.png`, fullPage: false });
    }

    await page.close();
  }

  await browser.close();
});
