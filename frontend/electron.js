const { app, BrowserWindow, systemPreferences } = require('electron');
// const path = require('path');
// const url =require('url');
const isDev = true; // require('electron-is-dev');
const isAdmin = true;
const START_URL = isAdmin ? 'http://144.126.254.71/admin' : 'https://144.126.254.71';
app.commandLine.appendSwitch('ignore-certificate-errors')
// const camera = systemPreferences.askForMediaAccess('camera');

let mainWindow;

const createWindow = () => {
    let mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        icon: '',
        webPreferences: {
            nodeIntegration: true,
        },
    });
    const startUrl = isDev ? START_URL : `file://${__dirname}/build/index.html`;

    mainWindow.loadURL(startUrl);
    if (isDev) {
        // mainWindow.webContents.openDevTools({ mode: 'right' });
    }
    mainWindow.on('closed', () => (mainWindow = null));
};

app.on('ready', () => {

    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (process.platform !== 'darwin') {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    } else {
        if (mainWindow === null) {
            createWindow();
        }
    }
});