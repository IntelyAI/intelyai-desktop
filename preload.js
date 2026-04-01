const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  platform: process.platform,
  getAppVersion: () => require("./package.json").version,
  isElectron: true,
});

// Intercept web Notification API and forward to native OS notifications
const OriginalNotification = Notification;
window.Notification = class extends OriginalNotification {
  constructor(title, options = {}) {
    super(title, options);
    ipcRenderer.send("show-notification", { title, body: options.body || "" });
  }

  static get permission() {
    return "granted";
  }

  static requestPermission() {
    return Promise.resolve("granted");
  }
};
