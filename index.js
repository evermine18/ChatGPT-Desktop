const { app, BrowserWindow, Menu, MenuItem, clipboard,
     nativeImage, ipcMain, dialog, shell } = require('electron')
const { autoUpdater } = require('electron-updater');
const path = require('path');
const request = require('request').defaults({ encoding: null });  
const fs = require('fs');


const startURL = 'https://chat.openai.com/';

app.setName('ChatGPT - Client')

app.on('ready', () => {
    // Initializing window
    const win = new BrowserWindow({
        width: 1000,
        height: 800,
        frame: false,
        icon: path.join(__dirname, 'icon.png'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            partition: 'persist:myPartition',
            webviewTag: true 
          }
    });
    
    // Top bar frame events
    ipcMain.on('close-window', () => {
        win.close();
    });

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
    // Logo contextual menu events
    ipcMain.on('relaunch-app', () => {
        app.relaunch();
        app.exit(0);
    });

    ipcMain.on('open-dev-tools', () => {
        win.webContents.openDevTools();
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
    // Error updater handling
    autoUpdater.on('error', (error) => {
        dialog.showMessageBox({
            type: 'error',
            title: 'Error',
            message: 'Update Error: '+error.stack,
            buttons: ['OK']
        })
    });
    // New version available handling
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

    ipcMain.on('load-extension', () => {

        const EXTENSION_PATH = path.join(__dirname, 'app/better-gpt.build.js');
        const extensionScript = fs.readFileSync(EXTENSION_PATH, 'utf8');
        setTimeout(() => {
            win.webContents.send('execute-script-in-webview', extensionScript);
        }, 5000);
    });
    

    win.setMenu(null); // Disabling default menu

    // Context menu events
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
      
    win.loadFile('app/index.html');
    
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})