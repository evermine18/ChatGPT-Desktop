const { app, Menu } = require('electron')

class FrameMenu {

    constructor(handlers) {
        this.handlers = handlers;
        this.templates = this.setupTemplate();
        this.menu = Menu.buildFromTemplate(this.templates);
        Menu.setApplicationMenu(this.menu)
    }

    setupTemplate() {
        return [
            {
                label: 'ChatGPT App',
                
                submenu: [
                  { label: 'Reload', click: () => { this.handlers.reloadPageHandler() } },
                  { label: 'Relaunch App', click: () => { this.handlers.relaunchHandler() } },
                  { label: 'Enable/Disable folders(Beta)' },
                  { label: 'About', click: () => { this.handlers.aboutDialogHandler() } },
                  { type: 'separator' },
                  { label: 'Exit', click: () => { app.quit() } }
                ]
              }
        ]
    }

}
module.exports = FrameMenu;