import puppeteer from "puppeteer";

let browser: puppeteer.Browser;
export const pages = {
  twitter: null as any as puppeteer.Page,
  whatsapp: null as any as puppeteer.Page,
};

export async function createBrowser() {
  browser = await puppeteer.launch({ headless: false });

  pages.twitter = await setupPage();
  pages.whatsapp = await setupPage();
}

export function getBrowser() {
  return browser;
}

export async function setupPage() {
  const browser = getBrowser();
  const page = await browser.newPage();
  page.setViewport({ height: 720, width: 1280 });
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3641.0 Safari/537.36"
  );

  return page;
}
