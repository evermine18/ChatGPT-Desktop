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

document.getElementById('fix-gpt4').addEventListener('click', () => {
  ipcRenderer.send('relaunch-app');
})

// document.getElementById('devTools').addEventListener('click', () => {
//   ipcRenderer.send('open-dev-tools');
// })

document.getElementById('about').addEventListener('click', () => {
  ipcRenderer.send('about-dialog');
})
document.getElementById('enable-folders').addEventListener('click', () => {
  const webview = document.querySelector('webview');
    webview.executeJavaScript(`
      const experimentalFeatures = localStorage.getItem('experimentalFeatures');
      if (experimentalFeatures) {
        localStorage.setItem('experimentalFeatures', !JSON.parse(experimentalFeatures));
      } else {
        localStorage.setItem('experimentalFeatures', true);
      }
      location.reload(true);
  `);
  location.reload(true)
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
  //webview.openDevTools();
  webview.executeJavaScript(script);
});
