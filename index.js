const { app, BrowserWindow } = require('electron')
const fs = require('fs');
const path = require('path');

const startURL = 'https://chat.openai.com/'


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
    win.loadURL(startURL)
});


app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
app.setName('ChatGPT - Client')