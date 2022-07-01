import { app, BrowserWindow, nativeTheme, BrowserView, ipcMain, ipcRenderer, Menu, autoUpdater, dialog } from 'electron'
import path from 'path'
import os from 'os'

import { bindMsgCenter } from "./msg-center"

// needed in case process is undefined under Linux
const platform = process.platform || os.platform()

try {
    if (platform === 'win32' && nativeTheme.shouldUseDarkColors === true) {
        require('fs').unlinkSync(path.join(app.getPath('userData'), 'DevTools Extensions'))
    }
} catch (_) { }

let mainWindow;
let windows = {
    mainWindow: undefined
}

function createWindow() {
    /**
     * Initial window options
     */
    Menu.setApplicationMenu(null);
    mainWindow = new BrowserWindow({
        icon: path.resolve(__dirname, 'icons/icon.png'), // tray icon
        width: 1200,
        height: 700,
        useContentSize: true,
        webPreferences: {
            contextIsolation: true,
            // More info: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/electron-preload-script
            preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD)
        }
    })

    windows["mainWindow"] = mainWindow;
    mainWindow.loadURL(process.env.APP_URL)

    mainWindow.webContents.on("did-finish-load", function () {
        bindMsgCenter(ipcMain, windows);
    });

    if (process.env.DEBUGGING) {
        // if on DEV or Production with debug enabled
        mainWindow.webContents.openDevTools()
    } else {
        // we're on production; no access to devtools pls
        mainWindow.webContents.on('devtools-opened', () => {
            mainWindow.webContents.closeDevTools()
        })
    }

    mainWindow.on('closed', () => {
        mainWindow = null
    })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    if (platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow()
    }
})
