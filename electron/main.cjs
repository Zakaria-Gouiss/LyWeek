const path = require("path");
const { app, BrowserWindow, nativeImage } = require("electron");

const iconPath = path.join(__dirname, "../src/assets/lyweek.ico");

function createWindow() {
  const win = new BrowserWindow({
    width: 750,
    height: 540,
    icon: iconPath,
  });

  win.setAppDetails({
    appId: "com.lyweek.LyWeek",
    appIconPath: path.join(__dirname, "../src/assets/lyweek.ico"),
  });

  win.loadURL("https://lyweek.vercel.app?electron=true");
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