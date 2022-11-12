import puppeteer from "puppeteer";
import path from "path";

const timeout = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function getWhatsappQrCode(page: puppeteer.Page) {
  await page.waitForSelector("div.landing-window");
  await page.waitForSelector("div[data-testid=qrcode]");
  const qrCode = await page.$("div._25pwu");

  if (!qrCode) return;

  const boundingBox = (await qrCode.boundingBox())!;
  const qrPath = path.join(process.cwd(), `${Date.now()}.jpg`);
  await qrCode.screenshot({
    path: qrPath,
    clip: {
      ...boundingBox,
      y: boundingBox.y - 10,
      width: boundingBox.width + 20,
      x: boundingBox.x - 10,
      height: boundingBox.height + 20,
    },
  });

  return qrPath;
}

export async function scrapeWhatsapp(page: puppeteer.Page) {
  await page.goto("https://web.whatsapp.com");

  const path = await getWhatsappQrCode(page);

  console.log(`Scan: ${path}`);

  await page.waitForSelector("div[data-testid=chat-list]");

  await timeout(4000);

  const chatList = (await page.$("div[data-testid=chat-list] > div"))!;

  const contacts = await chatList.evaluate((el) => {
    return [...el.children].map((item) => {
      // div -> div._1Oe6M -> div[role=row] -> div[cell-frame-container]
      const parentEl = item.children[0].children[0].children[0];

      // [div, div]
      const [profile, description] = parentEl.children;
      const profileParentEl = profile.children[0].children[0];
      const maybeImg = profileParentEl.children[0];
      const spanEl = description.children[0].children[0].children[0];

      if (maybeImg.tagName === "IMG") {
        return {
          name: spanEl.textContent,
          img: (maybeImg as any).src,
        };
      }

      return { name: spanEl.innerHTML, img: undefined };
    });
  });

  return contacts;
}

async function loginTwitter(page: puppeteer.Page) {
  await page.goto("https://twitter.com/login");

  await page.waitForSelector("input[name=text]");

  await page.type("input[name=text]", "mokshit06");
  await page.click("div[role=button]:nth-of-type(6)");

  await page.waitForSelector("input[name=password]");

  await page.type("input[name=password]", "");

  await page.waitForSelector("div[role=button]");
  const [, , submitButton] = await page.$$("div[role=button]");
  // submitButton.click();
  const [response] = await Promise.all([
    page.waitForNavigation(),
    submitButton.click(),
  ]);
}

export async function scrapeTwitter(page: puppeteer.Page) {
  await loginTwitter(page);

  await page.goto("https://twitter.com/messages");

  await page.waitForSelector("div[role=tablist]");
  await page.waitForSelector("div[data-testid=cellInnerDiv]");

  const tabListEl = await page.$("div[role=tablist]");

  await page.screenshot({ path: "f.jpg" });

  const tabList = await tabListEl!.evaluate((tabList) => {
    // removes the first element
    // which is the "Search direct messages" div
    return [...tabList.children].slice(1).map((item) => {
      if (item?.children?.[0]?.children?.[0]?.children?.[0] == undefined)
        return {};

      console.log(
        item?.children?.[0]?.children?.[0]?.children?.[0]?.children?.[0]
          ?.children
      );

      const [profile, description] =
        item?.children?.[0]?.children?.[0]?.children?.[0]?.children?.[0]
          ?.children;

      if (!profile || !description) return {};

      const img = (profile.querySelector(":scope img") as any).src;
      const [name, username] = description.querySelectorAll(
        ":scope span:not(:has(span))"
      );

      return {
        img,
        name: name.innerHTML,
        username: username.innerHTML,
      };
    });
  });

  console.log(tabList);

  await page.screenshot({ path: path.join(process.cwd(), "f.jpg") });
}

async function scrape() {
  console.log("starting");
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  page.setViewport({ height: 720, width: 1280 });
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3641.0 Safari/537.36"
  );

  // const contacts = await scrapeWhatsapp(page);
  const contacts = await scrapeTwitter(page);

  // await page.close();
  console.log(contacts);
}

scrape();
