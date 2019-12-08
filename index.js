const { app, BrowserWindow, Menu } = require("electron");
const { autoUpdater } = require('electron-updater');
const menu = require("./menu");
let window;

Menu.setApplicationMenu(menu);

app.on("ready", () => {
  window = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  window.loadFile("index.html");
  autoUpdater.checkForUpdatesAndNotify();
});

