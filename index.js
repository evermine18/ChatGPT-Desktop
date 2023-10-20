const { app, BrowserWindow, Menu, MenuItem } = require('electron')
const fs = require('fs');
const path = require('path');

const startURL = 'https://chat.openai.com/'

const contextMenu = new Menu();

contextMenu.append(new MenuItem({ label: 'Copiar', role: 'copy' }));
contextMenu.append(new MenuItem({ label: 'Cortar', role: 'cut' }));
contextMenu.append(new MenuItem({ label: 'Pegar', role: 'paste' }));
contextMenu.append(new MenuItem({ type: 'separator' }));
contextMenu.append(new MenuItem({ label: 'Seleccionar todo', role: 'selectall' }));

app.on('ready', () => {
    const win = new BrowserWindow({
        width: 1000,
        height: 800,
        icon: path.join(__dirname, 'icon.ico')
    });

    // Asumiendo que el script de contenido de la extensión se llama "contentScript.js"
    const EXTENSION_PATH = path.join(__dirname,'content.js');
    const extensionScript = fs.readFileSync(EXTENSION_PATH, 'utf8');

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
        contextMenu.popup(win, params.x, params.y);
      });
    win.loadURL(startURL)
});


app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
app.setName('ChatGPT - Client')