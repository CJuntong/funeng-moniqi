// 赋能模拟器 · Electron 主进程
// 职责：创建桌面窗口并加载现有网页原型（index.html），不读写游戏文件
const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 1360,
    height: 900,
    minWidth: 960,
    minHeight: 640,
    title: "赋能模拟器",
    backgroundColor: "#0f1923",
    autoHideMenuBar: true,
    icon: path.join(__dirname, "icons", "icon.ico"),
    webPreferences: {
      contextIsolation: true,
      sandbox: true,
    },
  });
  win.removeMenu?.();
  win.loadFile(path.join(__dirname, "..", "index.html"));
}

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
