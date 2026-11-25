const path = require("path");
const { app, BrowserWindow, shell } = require("electron");

const iconPath = path.join(__dirname, "../src/assets/lyweek.ico");

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 540,
    icon: iconPath,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
    },
  });

  win.setAppDetails({
    appId: "com.lyweek.LyWeek",
    appIconPath: iconPath,
  });

  const appOrigin = !app.isPackaged
    ? "http://localhost:5173"
    : "https://lyweek.vercel.app";

  // Helper to decide if a URL belongs to your app or should open externally
  const isExternalUrl = (url) => {
    if (!url || url === "about:blank") return false;
    return !url.startsWith(appOrigin);
  };

  // 1. Intercept new windows (target="_blank" or window.open)
  win.webContents.setWindowOpenHandler(({ url }) => {
    // Allow temporary about:blank windows if your frontend opens a blank tab before redirecting
    if (url === "about:blank") {
      return { action: "allow" };
    }

    if (isExternalUrl(url)) {
      // Passes http://, https://, AND custom app protocols (e.g., slack://, notion://) to the OS
      shell.openExternal(url);
      return { action: "deny" };
    }

    return { action: "allow" };
  });

  // 2. Intercept same-window navigation AND redirects inside temporary windows
  win.webContents.on("will-navigate", (event, url) => {
    if (isExternalUrl(url)) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });

  // 3. Catch secondary windows if your frontend uses window.open() + location.href
  win.webContents.on("did-create-window", (childWindow) => {
    childWindow.webContents.on("will-navigate", (event, url) => {
      if (isExternalUrl(url)) {
        event.preventDefault();
        shell.openExternal(url);
        childWindow.close(); // Close the blank popup window immediately
      }
    });
  });

  if (!app.isPackaged) {
    win.loadURL("http://localhost:5173");
  } else {
    win.loadURL("https://lyweek.vercel.app");
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
