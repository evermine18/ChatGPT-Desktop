const { app, BrowserWindow, Menu, MenuItem, clipboard, nativeImage, ipcMain } = require('electron')
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
    //win.webContents.openDevTools();

    ipcMain.on('close-window', () => {
    win.close();
    });

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
    
    win.setMenu(null);
    win.webContents.on('context-menu', (e, params) => {
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