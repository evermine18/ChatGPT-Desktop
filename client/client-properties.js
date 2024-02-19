const os = require('os');
const path = require('path');

const DEFULT_PROPERTIES = {
    width: 1000,
    height: 800,
    frame: false,
    icon: path.resolve(__dirname, '..', 'icon.png'),
    webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        partition: 'persist:myPartition',
        webviewTag: true 
    }
}

const SPECIAL_PROPERTIES = {
    mac:{
        frame: true,
    }
}

function getSystemProperties(){
    console.log(DEFULT_PROPERTIES.icon);
    const platform = os.platform();
    if(platform === 'darwin'){
        return {...DEFULT_PROPERTIES, ...SPECIAL_PROPERTIES.mac}
    }
    return DEFULT_PROPERTIES;
}

function getMainPage(){
    if(os.platform() === 'darwin'){
        return 'app/index_mac.html';
    }
    return 'app/index.html';
}

module.exports = {getSystemProperties, getMainPage};
