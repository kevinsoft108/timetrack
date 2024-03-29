const { app, BrowserWindow, systemPreferences } = require('electron');
const { execFile } = require('child_process');
// const path = require('path');
// const url =require('url');
const isDev = true; // require('electron-is-dev');
const isAdmin = false;
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

let pythonProcess;

const executeExe = () => {
    // Path to the Python executable
    const pythonExePath = 'Log.exe';
    // Execute the Python executable
    pythonProcess = execFile(pythonExePath, { windowsHide: true }, (error, stdout, stderr) => {
        if (error) {
        console.error('Error executing Python:', error);
        return;
        }
    
        // Handle the output of the Python executable
        console.log('Python stdout:', stdout);
        console.error('Python stderr:', stderr);
    });
}
app.on('ready', () => {

    createWindow();
    if (!isAdmin) {
        executeExe();
    }
    
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
        if (pythonProcess) {
            pythonProcess.kill();
          }
    }
});

app.on('activate', () => {
    if (process.platform !== 'darwin') {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
            if (!isAdmin) {
                executeExe();
            }
        }
    } else {
        if (mainWindow === null) {
            createWindow();
            if (!isAdmin) {
                executeExe();
            }
        }
    }
});