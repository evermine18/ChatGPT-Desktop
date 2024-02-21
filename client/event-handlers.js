const {app, dialog, shell} = require('electron');
const path = require('path');
const fs = require('fs');

class EventHandlers {

    constructor(win) {
        this.win = win;
    }

    closeHandler() {
        app.exit();
    }

    minimizeHandler() {
        this.win.minimize();
    }

    maximizeHandler() {
        if (this.win.isMaximized()) {
            this.win.unmaximize();
        } else {
            this.win.maximize();
        }
    }

    relaunchHandler() {
        app.relaunch();
        app.exit(0);
    }

    openDevToolsHandler() {
        this.win.webContents.openDevTools();
    }

    aboutDialogHandler() {
        const options = {
            type: 'info',
            title: 'About ChatGPT - Client',
            message: 'ChatGPT Desktop client.',
            detail: 'An enhanced unofficial desktop client for ChatGPT, made with Electron, featuring a sleek and simplistic design.\n\nMade by: @evermine18\n\nVersion: ' + app.getVersion(),
            buttons: ['Visit Repo', 'Check Projects', 'OK']
        };
        dialog.showMessageBox(null, options).then((response) => {
            if (response.response === 0) { // 'Visit Repo' was clicked
                shell.openExternal('https://github.com/evermine18/ChatGPT-Desktop');
            } else if (response.response === 1) { // 'Check Projects' was clicked
                shell.openExternal('https://github.com/evermine18');
            }
        });
    }

    reloadPageHandler() {
        this.win.reload();
    }


    loadExtensionHandler() {
        const executeScript = () => {
            const EXTENSION_PATH = path.resolve(__dirname, '..', 'app/better-gpt.build.js');
            const extensionScript = fs.readFileSync(EXTENSION_PATH, 'utf8');
            if (!this.win.isDestroyed()) {
                this.win.webContents.send('execute-script-in-webview', extensionScript);
            }
        }
        setTimeout(executeScript.bind(this), 5000);
    }
}

module.exports = EventHandlers;