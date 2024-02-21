const { app, BrowserWindow, Menu, MenuItem, clipboard,
     nativeImage, ipcMain, dialog, shell } = require('electron')
const { autoUpdater } = require('electron-updater');
const request = require('request').defaults({ encoding: null });  
const {getSystemProperties, getMainPage} = require('./client/client-properties');
const os = require('os');
const EventHandlers = require('./client/event-handlers');
const FrameMenu = require('./client/menu');


const startURL = 'https://chat.openai.com/';

app.setName('ChatGPT - Client')

app.on('ready', () => {
    // Initializing window
    const win = new BrowserWindow(getSystemProperties());
    const handlers = new EventHandlers(win);
    if(os.platform() === 'darwin'){
        const menu = new FrameMenu(handlers);
    }else{
        win.setMenu(null); // Disabling default menu
    }
    // Top bar frame events
    ipcMain.on('close-window', handlers.closeHandler);

    ipcMain.on('minimize-window', handlers.minimizeHandler.bind(handlers));
    
    ipcMain.on('maximize-window', handlers.maximizeHandler.bind(handlers));
    // Logo contextual menu events
    ipcMain.on('relaunch-app', handlers.relaunchHandler.bind(handlers));

    ipcMain.on('open-dev-tools', handlers.openDevToolsHandler.bind(handlers));

    ipcMain.on('about-dialog', handlers.aboutDialogHandler.bind(handlers));    
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

    ipcMain.on('load-extension', handlers.loadExtensionHandler.bind(handlers));
    

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
      
    win.loadFile(getMainPage());
    
});
