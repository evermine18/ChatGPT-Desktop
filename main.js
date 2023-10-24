const { ipcRenderer } = require('electron');

const startURL = 'https://chat.openai.com/';

document.getElementById('minimize').addEventListener('click', () => {
  ipcRenderer.send('minimize-window');
});

document.getElementById('maximize').addEventListener('click', () => {
  ipcRenderer.send('maximize-window');
});

document.getElementById('close').addEventListener('click', () => {
  ipcRenderer.send('close-window');
});
const webview = document.querySelector('webview');

webview.addEventListener('context-menu', (e) => {
  e.preventDefault();
  ipcRenderer.send('context-menu', {
    x: e.x,
    y: e.y,
    srcURL: e.srcURL,
    mediaType: e.mediaType
  });
});

webview.addEventListener('did-finish-load', () => {
  const currentURL = webview.getURL();
  if (currentURL === startURL) {
      ipcRenderer.send('load-extension');
  }
});

ipcRenderer.on('execute-script-in-webview', (event, script) => {
  const webview = document.querySelector('webview');
  webview.executeJavaScript(script);
});