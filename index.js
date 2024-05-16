const { app, BrowserWindow, globalShortcut, ipcMain } = require("electron");
const electronDrag = require("electron-drag");
const fs = require("fs");

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 200,
        height: 100,
        frame: false, // 无边框
        alwaysOnTop: true, // 始终悬浮在最上层
        transparent: true, // 透明背景
        resizable: false, // 禁止调整大小
        webPreferences: {
            preload: __dirname + "/preload.js",
            contextIsolation: true, // 确保使用 contextBridge
            nodeIntegration: true
        }
    });

    electronDrag(mainWindow);

    mainWindow.loadURL("http://localhost:9000");

    // 注册 'Ctrl+Shift+Left' 的全局快捷键
    const retLeft = globalShortcut.register("Control+Shift+Left", () => {
        mainWindow.webContents.send("key-event", "Ctrl+Shift+Left");
    });
    const retUp = globalShortcut.register("Control+Shift+Up", () => {
        mainWindow.webContents.send("key-event", "Ctrl+Shift+Up");
    });

    if (!retLeft) {
        console.log("registration for Ctrl+Shift+Left failed");
    }

    // 注册 'Ctrl+Shift+Right' 的全局快捷键
    const retRight = globalShortcut.register("Control+Shift+Right", () => {
        mainWindow.webContents.send("key-event", "Ctrl+Shift+Right");
    });

    if (!retRight) {
        console.log("registration for Ctrl+Shift+Right failed");
    }

    // 检查快捷键是否注册成功
    console.log(
        "Ctrl+Shift+Left registered:",
        globalShortcut.isRegistered("Control+Shift+Left")
    );
    console.log(
        "Ctrl+Shift+Right registered:",
        globalShortcut.isRegistered("Control+Shift+Right")
    );
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

ipcMain.handle("save-data", (event, data) => {
    fs.writeFileSync("./data.json", data);
});

ipcMain.handle("load-data", () => {
    try {
        return JSON.parse(fs.readFileSync("./data.json"));
    } catch (err) {
        return;
    }
});
