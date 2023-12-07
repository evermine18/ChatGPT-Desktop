import components from '../components.json'

class Folders {
    constructor() {
        this.chat_list = undefined;
        init();
    }

    init(){
        this.chat_list = document.querySelector('div.flex.flex-col.gap-2.pb-2.dark\\:text-gray-100.text-gray-800.text-sm > div > span > div')
    
    }
}
export default Folders;
