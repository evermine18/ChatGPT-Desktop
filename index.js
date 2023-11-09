const { app, BrowserWindow, Menu, MenuItem, clipboard,
     nativeImage, ipcMain, dialog, shell } = require('electron')
const { autoUpdater } = require('electron-updater');
const fs = require('fs');
const path = require('path');
const request = require('request').defaults({ encoding: null });  

const startURL = 'https://chat.openai.com/'

app.on('ready', () => {
    const win = new BrowserWindow({
        width: 1000,
        height: 800,
        frame: false,
        icon: path.join(__dirname, 'icon.ico'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            partition: 'persist:myPartition',
            webviewTag: true 
          }
    });

    const EXTENSION_PATH = path.join(__dirname,'content.js');
    const extensionScript = fs.readFileSync(EXTENSION_PATH, 'utf8');

    ipcMain.on('minimize-window', () => {
        win.minimize();
      });
    
    ipcMain.on('maximize-window', () => {
    if (win.isMaximized()) {
        win.unmaximize();
    } else {
        win.maximize();
    }
    });
    ipcMain.on('relaunch-app', () => {
        app.relaunch();
        app.exit(0);
    });
    ipcMain.on('about-dialog', () => {
        const options = {
            type: 'info',
            title: 'About ChatGPT - Client',
            message: 'ChatGPT Desktop client.',
            detail: 'An enhanced unofficial desktop client for ChatGPT, made with Electron, featuring a sleek and simplistic design.\n\nMade by: @evermine18\n\nVersion: '+app.getVersion(),
            buttons: ['Visit Repo', 'Check Projects', 'OK']
        };
        dialog.showMessageBox(null, options).then((response) => {
            if (response.response === 0) { // 'Visit Repo' was clicked
                shell.openExternal('https://github.com/evermine18/ChatGPT-Desktop');
            } else if (response.response === 1) { // 'Check Projects' was clicked
                shell.openExternal('https://github.com/evermine18');
            }
        });
    })
    //win.webContents.openDevTools();

    ipcMain.on('close-window', () => {
    win.close();
    });

    autoUpdater.on('error', (error) => {
    dialog.showMessageBox({
        type: 'error',
        title: 'Error',
        message: 'Update Error: '+error.stack,
        buttons: ['OK']
    })
    });
    autoUpdater.on('update-downloaded', () => {
        dialog.showMessageBox({
          type: 'info',
          title: 'New version available',
          message: 'A new version has been downloaded. Do you want to install it now?\n\nNote: The app will be updated on the next launch if you choose not to update now.',
          buttons: ['YES', 'NO']
        }).then(result => {
          if (result.response === 0) {
            autoUpdater.quitAndInstall();
          }
        });
    });

      autoUpdater.checkForUpdates()
    win.webContents.on('did-finish-load', () => {
        // Checking if the user are in ChatGPT app page
        const currentURL = win.webContents.getURL();
        if(currentURL === startURL){
            setTimeout(() => {
                // Loading extension
                win.webContents.executeJavaScript(extensionScript);
            },5000);
        }   
    });
    /*
    Temporary disabled due no more cap for GPT-4

    ipcMain.on('load-extension', () => {

        const EXTENSION_PATH = path.join(__dirname, 'content.js');
        const extensionScript = fs.readFileSync(EXTENSION_PATH, 'utf8');
        setTimeout(() => {
            win.webContents.send('execute-script-in-webview', extensionScript);
        }, 5000);
    });
    */
    win.setMenu(null);
    ipcMain.on('context-menu', (e, params) => {
        const contextMenu = new Menu();
        if (params.mediaType === 'image') {
            contextMenu.append(new MenuItem({
                label: 'Copy image',
                click: () => {
                    request.get(params.srcURL, (error, response, body) => {
                        if (error) {
                            console.error('Error obtaining the image:', error);
                            return;
                        }
                        
                        const image = nativeImage.createFromBuffer(body);
                        clipboard.writeImage(image);
                    });
                }
            }));
        }else{
            contextMenu.append(new MenuItem({ label: 'Copy', role: 'copy' }));
            contextMenu.append(new MenuItem({ label: 'Cut', role: 'cut' }));
            contextMenu.append(new MenuItem({ label: 'Paste', role: 'paste' }));
            contextMenu.append(new MenuItem({ type: 'separator' }));
            contextMenu.append(new MenuItem({ label: 'Select all', role: 'selectall' }));
        }
        contextMenu.popup(win, params.x, params.y);
      });
    //win.loadURL(startURL)
    win.loadFile('index.html');
});


app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
app.setName('ChatGPT - Client')