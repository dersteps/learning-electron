const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow;

const windowW = 800;
const windowH = 600;

function getCenterX() {
    const w = electron.screen.getPrimaryDisplay().workAreaSize.width;
    return (w/2) - (windowW/2);
}

function getCenterY() {
    const h = electron.screen.getPrimaryDisplay().workAreaSize.height;
    return (h/2) - (windowH/2);
}

app.on('ready', function() {
    mainWindow = new BrowserWindow({width: windowW, height: windowH, x: getCenterX(), y: getCenterY()});
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'main.html'),
        protocol: 'file:',
        slashes: true
    }));

    mainWindow.on('close', function() {
        app.quit();
    });
    
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    mainWindow.setMenu(mainMenu);
});

// From add item window javascript
ipcMain.on('item:add', function(event, payload) {
    // just pass it on to the main window
    mainWindow.webContents.send('item:add', payload);
});

const mainMenuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Quit',
                accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click() {
                    app.quit();
                }
            }
        ]
    }
];

// Mac menu workaround
if(process.platform == 'darwin') {
    // Push empty menu item on top
    mainMenuTemplate.unshift({});
}

if(process.env.NODE_ENV !== 'production') {
    mainMenuTemplate.push({
        label: 'Dev tools',
        submenu: [
            {
                label: 'Toggle dev tools',
                accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    });
}
