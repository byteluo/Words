const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
    onKeyEvent: (callback) =>
        ipcRenderer.on("key-event", (event, key) => callback(key)),
    saveData: (data) => ipcRenderer.invoke("save-data", data),
    loadData: () => ipcRenderer.invoke("load-data")
});
