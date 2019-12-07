const {
  app,
  Menu,
  shell,
  ipcMain,
  BrowserWindow,
  globalShortcut,
  dialog
} = require("electron");
const fs = require("fs");

const template = [
  {
    label: "Format",
    submenu: [
      {
        label: "Toggle Bold",
        click() {
          const window = BrowserWindow.getFocusedWindow();
          window.webContents.send("editor-event", "toggle-bold");
        }
      }
    ]
  },
  {
    role: "help",
    submenu: [
      {
        label: "About Editor Component",
        click() {
          shell.openExternal("https://simplemde.com/");
        }
      }
    ]
  }
];
if (process.env.DEBUG) {
  template.push({
    label: "Debugging",
    submenu: [
      {
        role: "toggleDevTools"
      },
      { type: "separator" },
      { role: "reload", accelerator: "Alt+R" }
    ]
  });
}
ipcMain.on("editor-reply", (event, arg) => {
  console.log(`Received reply from web page: ${arg}`);
});
ipcMain.on("save", (event, arg) => {
  const window = BrowserWindow.getFocusedWindow();
  const options = {
    title: "Save markdown file",
    filters: [
      {
        name: "MyFile",
        extensions: ["md"]
      }
    ]
  };
  dialog.showSaveDialog(window, options).then(filename => {
    console.log(filename);
    if (!filename.canceled) {
      console.log(`Saving content of the file`);
      console.log(arg);
      fs.writeFileSync(filename.filePath, arg);
    }
  });
});

function loadFile(){
  const window = BrowserWindow.getFocusedWindow();

  const options = {
    title: "Pick a markdown file",
    filters: [
      { name: "Markdown files", extensions: ["md"] },
      { name: "Text files", extensions: ["txt"] }
    ]
  };

  dialog.showOpenDialog(window, options).then(ret => {
    console.log(`Opening the file`);
    console.log(ret);
    if (!ret.canceled && ret.filePaths[0].length > 0) {
      const content = fs.readFileSync(ret.filePaths[0]).toString();
      window.webContents.send("load", content);
    }
  });
}

function saveFile(){
  console.log("Saving the file");
  const window = BrowserWindow.getFocusedWindow();

  window.webContents.send("editor-event", "save");
}

app.on("ready", () => {
  globalShortcut.register("CommandOrControl+S", () => {
    saveFile();
  });

  globalShortcut.register("CommandOrControl+O", () => {
    loadFile();
  });
});

const menu = Menu.buildFromTemplate(template);
module.exports = menu;
