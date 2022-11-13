// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//

// import IPFS from "ipfs-core";

process.env.DIST_ELECTRON = join(__dirname, "../..");
process.env.DIST = join(process.env.DIST_ELECTRON, "../dist");
process.env.PUBLIC = app.isPackaged
  ? process.env.DIST
  : join(process.env.DIST_ELECTRON, "../public");

import { app, BrowserWindow, shell, ipcMain, dialog } from "electron";
import { release } from "os";
import { join, resolve } from "path";
import {
  getWhatsappQrCode,
  loginTwitter,
  scrapeTwitter,
  scrapeWhatsapp,
  twitterChatsFor,
  whatsappChatsFor,
} from "./scraper";
import { createBrowser } from "./singletons";

// Disable GPU Acceleration for Windows 7
if (release().startsWith("6.1")) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === "win32") app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

const isDev = process.env.NODE_ENV == "development";

if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient("text-app", process.execPath, [
      resolve(process.argv[1]),
    ]);
  }
} else {
  app.setAsDefaultProtocolClient("text-app");
}

let win: BrowserWindow | null = null;
// Here, you can also use other preload
const preload = join(__dirname, "../preload/index.js");
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = join(process.env.DIST, "index.html");

async function createWindow() {
  win = new BrowserWindow({
    title: "Main window",
    icon: join(process.env.PUBLIC, "favicon.svg"),
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  await createBrowser();

  if (process.env.VITE_DEV_SERVER_URL) {
    // electron-vite-vue#298
    win.loadURL(url);
    // Open devTool if the app is not packaged
    win.webContents.openDevTools();
  } else {
    win.loadFile(indexHtml);
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  ipcMain.on("get-whatsapp-qr", async (event) => {
    event.sender.send("receive-whatsapp-qr", await getWhatsappQrCode());
  });

  ipcMain.on("load-chats", async (event) => {
    const contacts = await scrapeWhatsapp();

    event.sender.send("chats-loaded", contacts);
  });

  ipcMain.on("load-single-chat", async (event, [type, arg]) => {
    let chats =
      type === "whatsapp"
        ? await whatsappChatsFor(arg)
        : await twitterChatsFor(arg);
    console.log({ chats: typeof chats });

    event.sender.send("single-chat-loaded", chats);
  });

  ipcMain.on("connect-twitter", async (event, arg) => {
    await loginTwitter(arg[0], arg[1]);

    const messages = await scrapeTwitter();

    event.sender.send("twitter-connected", messages);
  });

  ipcMain.on("store-ipfs", async (event, arg) => {
    // const node = await IPFS.create();
    // const results = await node.add(arg);
    // results.cid.toString();
    // event.returnValue = ""
  });

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https:")) shell.openExternal(url);
    return { action: "deny" };
  });
}

app.whenReady().then(createWindow);

app.on("open-url", (event, url) => {
  event.preventDefault();
  console.log({ url });
  dialog.showErrorBox("Welcome Back", `You arrived from: ${url}`);
});

app.on("window-all-closed", () => {
  win = null;
  if (process.platform !== "darwin") app.quit();
});

app.on("second-instance", () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.on("activate", () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});

// new window example arg: new windows url
ipcMain.handle("open-win", (event, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  if (app.isPackaged) {
    childWindow.loadFile(indexHtml, { hash: arg });
  } else {
    childWindow.loadURL(`${url}#${arg}`);
    // childWindow.webContents.openDevTools({ mode: "undocked", activate: true })
  }
});
