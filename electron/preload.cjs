const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("lyweekElectron", {
  isElectron: true,
});
