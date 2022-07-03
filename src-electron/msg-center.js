import {
  app,
  BrowserWindow,
  nativeTheme,
  BrowserView,
  ipcMain,
  ipcRenderer,
  Menu,
  autoUpdater,
  dialog,
} from 'electron'
import * as log from './lib/log.js'
import * as utils from './lib/utils.js'
import path from 'path'
import os from 'os'
import * as injectScripts from './scripts'

// const fs = require("fs");
// const path = require("path");
const moment = require('moment')
let send2win = utils.send2win

let debug = true

function initNewWindow(url, windows) {
  let count = 0
  let newWindow = new BrowserWindow({
    width: 1200,
    height: 700,
    frame: true,
    autoHideMenuBar: false,
    maximizable: true,
    resizable: true,
    show: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD),
    },
  })
  newWindow.webContents.on('did-fail-load', function () {
    if (count >= 5) {
      windows.mainWindow.webContents.send('fromMain', {
        msg: 'initFail',
        target: url,
      })
      return false
    }
    newWindow.loadURL(url)
    count++
  })
  // newWindow.on('close', (event) => {
  //     event.preventDefault();
  //     creditWindow.hide();
  // });
  let windowHide = function () {
    windows.mainWindow.webContents.send('fromMain', {
      msg: 'windowHide',
      target: url,
    })
  }
  newWindow.on('hide', windowHide)
  newWindow.on('minimize', windowHide)

  newWindow.loadURL(url)

  newWindow.webContents.on('did-finish-load', function () {
    newWindow.webContents.executeJavaScript(injectScripts.defaultInit)
  })
  if (process.env.DEBUGGING && debug) {
    newWindow.webContents.openDevTools()
  }
}

/**
 *  ipc 进程间消息中转中心
 */
async function bindMsgCenter(ipcMain, windows) {
  let mainWindow = windows.mainWindow

  ipcMain.on('toMain', async (event, args) => {
    let source = args['source']
    if (mainWindow === null) {
      // app.quit();
      return
    }
    switch (source) {
      case 'main':
        send2win(mainWindow, { msg: 'mainReceive' })
        log.operation.info('main', args)
        switch (args['msg']) {
          case 'getAssetsPath':
            send2win(mainWindow, {
              msg: 'assetsPaths',
              data: {
                logSrc: utils.getLogPath(),
                dataSrc: utils.getDataSavePath(),
              },
            })
            break
          case 'accessUrl':
            initNewWindow(args['target'], windows)
            break
        }
        break
    }
  })
}

export { bindMsgCenter }
