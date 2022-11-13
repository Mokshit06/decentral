import puppeteer from "puppeteer";
import path from "path";
import { pages } from "./singletons";

const timeout = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function getWhatsappQrCode() {
  await pages.whatsapp.goto("https://web.whatsapp.com");
  await pages.whatsapp.waitForSelector("div.landing-window");
  await pages.whatsapp.waitForSelector("div[data-testid=qrcode]");
  const qrCode = await pages.whatsapp.$("div._25pwu");

  if (!qrCode) return;

  const boundingBox = (await qrCode.boundingBox())!;
  const file = `${Date.now()}.jpg`;
  const qrPath = path.join(process.cwd(), `public/${file}`);
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

  return file;
}

export async function scrapeWhatsapp() {
  await pages.whatsapp.goto("https://web.whatsapp.com");

  await pages.whatsapp.waitForSelector("div[data-testid=chat-list]", {
    timeout: 20000,
  });

  await timeout(4000);

  const chatList = (await pages.whatsapp.$(
    "div[data-testid=chat-list] > div"
  ))!;

  const contacts = await chatList.evaluate((el) => {
    return [...(el.children as any)].map((item) => {
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
          chat: "whatsapp",
        };
      }

      return { name: spanEl.innerHTML, img: undefined };
    });
  });

  return contacts;
}

export async function whatsappChatsFor(user: string) {
  const chatList = (await pages.whatsapp.$(
    "div[data-testid=chat-list] > div"
  ))!;

  const element = await chatList.$(
    `:scope span:not(:has(span))[title="${user}"]`
  );

  element.click();

  await timeout(1000);

  await pages.whatsapp.waitForSelector('div[role="application"]');

  const application = (await pages.whatsapp.$("div[role=application]"))!;
  const data = await application.evaluate((el) => {
    return [...(el.children as any as HTMLDivElement[])]
      .filter((messageEl) => messageEl.dataset.id != null)
      .map((messageEl) => {
        const outgoing = messageEl.classList.contains("message-out");
        const timeStampEl = messageEl.querySelector(
          ":scope div[data-pre-plain-text]"
        );
        const content = timeStampEl.querySelector(
          "span:not(:has(span))"
        ).innerHTML;
        const [time] = timeStampEl.dataset.prePlainText.slice(1).split("]");

        return {
          content,
          time,
          outgoing,
        };
      });
  });

  return data;
}

export async function loginTwitter(username: string, password: string) {
  await pages.twitter.goto("https://twitter.com/login");

  await pages.twitter.waitForSelector("input[name=text]");

  await pages.twitter.type("input[name=text]", username);
  await pages.twitter.click("div[role=button]:nth-of-type(6)");

  await pages.twitter.waitForSelector("input[name=password]");

  await pages.twitter.type("input[name=password]", password);

  await pages.twitter.waitForSelector("div[role=button]");
  const [, , submitButton] = await pages.twitter.$$("div[role=button]");
  // submitButton.click();
  const [response] = await Promise.all([
    pages.twitter.waitForNavigation(),
    submitButton.click(),
  ]);
}

export async function scrapeTwitter() {
  await pages.twitter.goto("https://twitter.com/messages");

  await pages.twitter.waitForSelector("div[role=tablist]");
  await pages.twitter.waitForSelector("div[data-testid=cellInnerDiv]");

  const tabListEl = await pages.twitter.$("div[role=tablist]");

  const tabList = await tabListEl!.evaluate((tabList) => {
    // removes the first element
    // which is the "Search direct messages" div
    return [...(tabList.children as any)].slice(1).map((item) => {
      if (item?.children?.[0]?.children?.[0]?.children?.[0] == undefined)
        return {};

      console.log(
        item?.children?.[0]?.children?.[0]?.children?.[0]?.children?.[0]
          ?.children
      );

      const [profile, description] =
        item?.children?.[0]?.children?.[0]?.children?.[0]?.children?.[0]
          ?.children ?? [];

      if (!profile || !description) return {};

      const img = (profile.querySelector(":scope img") as any).src;
      const [name, username] = description.querySelectorAll(
        ":scope span:not(:has(span))"
      );

      return {
        img,
        name: name.innerHTML,
        username: username.innerHTML,
        chat: "twitter",
      };
    });
  });

  console.log(tabList);

  return tabList;
}

export async function twitterChatsFor(username: string) {
  await pages.twitter.goto("https://twitter.com/messages");

  await pages.twitter.waitForSelector("div[role=tablist]");
  await pages.twitter.waitForSelector("div[data-testid=cellInnerDiv]");

  const tabListEl = await pages.twitter.$("div[role=tablist]");

  await timeout(2000);

  const span = (await tabListEl.$$("div[dir=ltr] >  span")).find((x) =>
    x.evaluate((x) => x.innerHTML === `@${username}`)
  );

  span.click();

  await pages.twitter.waitForSelector("div[data-testid=DmScrollerContainer]");

  return [];
}
