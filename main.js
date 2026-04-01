const { app, BrowserWindow, Tray, Menu, shell, nativeImage, Notification, ipcMain } = require("electron");
const path = require("path");
const config = require("./config");

let mainWindow = null;
let tray = null;

function getIcon() {
  const iconFile = process.platform === "win32" ? "icon.ico" : "icon.png";
  const iconPath = path.join(__dirname, "assets", iconFile);
  return nativeImage.createFromPath(iconPath);
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: config.WINDOW_WIDTH,
    height: config.WINDOW_HEIGHT,
    minWidth: config.MIN_WIDTH,
    minHeight: config.MIN_HEIGHT,
    icon: getIcon(),
    title: config.APP_NAME,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      partition: "persist:intely",
    },
  });

  mainWindow.loadURL(config.APP_URL);

  mainWindow.webContents.on("did-finish-load", () => {
    mainWindow.webContents.insertCSS(`
      ::-webkit-scrollbar { width: 8px; height: 8px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, 0.15);
        border-radius: 999px;
        border: 2px solid transparent;
        background-clip: content-box;
      }
      ::-webkit-scrollbar-thumb:hover { background: rgba(0, 0, 0, 0.3); background-clip: content-box; }
      ::-webkit-scrollbar-corner { background: transparent; }
      * { scrollbar-width: thin; scrollbar-color: rgba(0,0,0,0.15) transparent; }
    `);
  });

  // Open external links in the system browser instead of inside the app
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    const appHost = new URL(config.APP_URL).host;
    const linkHost = new URL(url).host;
    if (linkHost !== appHost) {
      shell.openExternal(url);
      return { action: "deny" };
    }
    return { action: "allow" };
  });

  mainWindow.webContents.session.setPermissionRequestHandler((_wc, permission, callback) => {
    callback(permission === "notifications" ? true : true);
  });

  // Minimize to tray instead of quitting
  mainWindow.on("close", (e) => {
    if (!app.isQuitting) {
      e.preventDefault();
      mainWindow.hide();
    }
  });
}

function createTray() {
  const icon = getIcon().resize({ width: 16, height: 16 });
  tray = new Tray(icon);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: `Abrir ${config.APP_NAME}`,
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
        }
      },
    },
    { type: "separator" },
    {
      label: "Salir",
      click: () => {
        app.isQuitting = true;
        app.quit();
      },
    },
  ]);

  tray.setToolTip(config.APP_NAME);
  tray.setContextMenu(contextMenu);

  tray.on("click", () => {
    if (mainWindow) {
      mainWindow.show();
      mainWindow.focus();
    }
  });
}

app.whenReady().then(() => {
  createWindow();
  createTray();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    } else {
      mainWindow.show();
    }
  });
});

ipcMain.on("show-notification", (_event, { title, body }) => {
  const notif = new Notification({
    title: title || config.APP_NAME,
    body: body || "",
    icon: getIcon(),
  });
  notif.on("click", () => {
    if (mainWindow) {
      mainWindow.show();
      mainWindow.focus();
    }
  });
  notif.show();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

