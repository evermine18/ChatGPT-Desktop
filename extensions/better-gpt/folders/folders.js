import components from '../components.json'
import API from '../requests';

class Folders {
    constructor() {
        this.chat_list = undefined;
        this.chats = [];
        this.init();
    }

    createChatListCategory(chats){
        return new Promise((resolve, reject) => {
            const list = document.createElement('ol');
            chats.forEach(chat => {
                const chatItem = document.createElement('li');
                chatItem.className = "relative z-[15]";
                chatItem.style.opacity = "1";
                chatItem.style.height = "auto";
                chatItem.style.transform = "none";
                chatItem.style.transformOrigin = "50% 50% 0px";
                chatItem.setAttribute("data-projection-id","11");
                //DIV
                const cont_div = document.createElement('div');
                cont_div.className =  "group relative active:opacity-90";
                //a
                const cont_a = document.createElement('a');
                cont_a.className = "flex items-center gap-2 rounded-lg p-2 hover:bg-token-surface-primary";
                cont_a.href = `/c/${chat.id}`;
                // title div
                const title_div = document.createElement('div');
                title_div.className = "relative grow overflow-hidden whitespace-nowrap";
                title_div.textContent = chat.title;
                //Appending all items
                cont_a.appendChild(title_div);
                cont_div.appendChild(cont_a);
                chatItem.appendChild(cont_div);
                list.appendChild(chatItem);
            });
            resolve(list);
        });
        
    }

    saveElementReferences(){
        const chatElements = document.querySelectorAll('li:has(> div a[href*="/c"])');
        chatElements.forEach(chat => {
            console.log(chat.getAttribute("href"));
        });
    }

    async init(){
        this.chat_list = document.querySelector('div.flex.flex-col.gap-2.pb-2.dark\\:text-gray-100.text-gray-800.text-sm > div > span')
        //console.log(localStorage.getItem("accessToken"));
        this.saveElementReferences();
        this.chat_list.innerHTML = "";
        this.chats = await API.GET('https://chat.openai.com/backend-api/conversations',{Authorization: localStorage.getItem("accessToken")});
        console.log(this.chats);
        this.chat_list.appendChild(await this.createChatListCategory(this.chats.items));
        
    }
}
export default Folders;
