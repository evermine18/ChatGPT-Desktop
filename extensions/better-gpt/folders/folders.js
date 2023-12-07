import components from '../components.json'
import API from '../requests';

class Folders {
    constructor() {
        this.chat_list = undefined;
        this.init();
    }

    async init(){
        this.chat_list = document.querySelector('div.flex.flex-col.gap-2.pb-2.dark\\:text-gray-100.text-gray-800.text-sm > div > span > div')
        //console.log(localStorage.getItem("accessToken"));
        console.log(await API.GET('https://chat.openai.com/backend-api/conversations',{Authorization: localStorage.getItem("accessToken")}));
    }
}
export default Folders;
