import components from '../components.json'
import API from '../requests';

class Folders {
    constructor() {
        this.chat_list = undefined;
        this.improved_chat_list = undefined;
        this.cat_definitions = {"Art":"#a434eb","Code Interpreter":"#f5d002","Research":"#3c45a6", "Testing":"#f59002","Utilities":"#179104", "No Category":"#FFFFFF"};
        this.currentChat = undefined;
        this.chats = {};
        this.loadingCategories = false;
        this.init();
    }

    createChatListCategory(category_name, color, chat_list, isOpen = true){
        const elem = document.createElement("div");
        let empty = true;
        elem.innerHTML = `<div style="background-color: ${color}; border-radius: 15px; width: fit-content; padding-inline: 3px;"><a href="#">${category_name}</a></div>`
        const ol = document.createElement("ol");
        ol.style.display = isOpen ? "block" : "none";
        Object.keys(this.chats).forEach(chat => {
            if(chat_list.includes(chat)){
                ol.appendChild(this.chats[chat]);
                empty = false;
            }
            
        })
        console.log(empty);
        if(empty) return null;
        elem.appendChild(ol);
        elem.querySelector("a").addEventListener('click', (e) => {
            e.stopPropagation();
            let category_list = JSON.parse(localStorage.getItem("category_list"));
            if(ol.style.display == "none"){
                category_list[category_name].open = true;
                ol.style.display = "block";
            }else{
                category_list[category_name].open = false;
                ol.style.display = "none";
            }
            localStorage.setItem("category_list",JSON.stringify(category_list));
        });
        return elem
    }

    saveElementReferences(){
        const chatElements = document.querySelectorAll('li:has(> div a[href*="/c"])');
        chatElements.forEach(chat => {
            const chathref = chat.querySelector('div a').getAttribute("href");
            const chatid = chathref.split("/")[2];
            this.chats[chatid] = chat.cloneNode(true);
            this.chats[chatid].querySelector('div a').setAttribute("href","#");
            // Adding a event listener to the new chat , and simulating the click on the old one
            this.chats[chatid].addEventListener('click', () => {
                // Checking if the chat is already loading or if the chat is the current one
                if(this.loadingCategories || this.currentChat == chatid) return;
                this.loadingCategories = true;
                this.currentChat = chatid;
                chat.querySelector('div a').click();
                // Reloading the extension with init method, in 5 seconds
                var reload_chats = setInterval(() => {
                    var elemento = document.querySelector("div.sticky.top-0.mb-1\\.5.flex.items-center.justify-between.z-10.h-14.bg-white.p-2.font-semibold.dark\\:bg-gray-800 > div.flex.gap-2.pr-1")
                    if (elemento) {
                        this.improved_chat_list.remove();
                        this.init();
                        this.loadingCategories = false;
                        clearInterval(reload_chats); // Clear the interval
                    }
                }, 200);
            });
            
        });
        console.log(this.chats);
    }

    renderChats(){
        const improved_chat_list = document.getElementById("improved-chat-list").querySelector('div');
        let category_list = localStorage.getItem("category_list");
        category_list = category_list ? JSON.parse(category_list) : {};
        let cat_dict = Object.keys(category_list)
        let chat_list = Object.keys(this.chats);
        for (let i = 0; i <= cat_dict.length; i++) {
            let elem
            if(i !== cat_dict.length){
                const isOpen = category_list[cat_dict[i]].open ? true : false;
                elem = this.createChatListCategory(cat_dict[i],category_list[cat_dict[i]].color,category_list[cat_dict[i]].chats, isOpen)
                chat_list = chat_list.filter(chat => !category_list[cat_dict[i]].chats.includes(chat));
            }else{
                elem = this.createChatListCategory("No Category","#FFFFFF",chat_list);
            }
            console.log(elem);
            if(elem !== null){
                improved_chat_list.appendChild(elem);
            }else{
                category_list[cat_dict[i]].chats=[]
            }
        }
    }

    addCategorySelect(){
        const topbar = document.querySelector("div.sticky.top-0.mb-1\\.5.flex.items-center.justify-between.z-10.h-14.bg-white.p-2.font-semibold.dark\\:bg-gray-800");
        const select = document.createElement("select");
        select.classList=("flex gap-2 pr-1");
        // Adding the options#007fff

        Object.keys(this.cat_definitions).forEach(category => {
            const option = document.createElement("option");
            option.value = category;
            option.innerHTML = category;
            select.appendChild(option);
        });

        // Check current chat category and set the corresponding option in the select
        const categoryList = localStorage.getItem("category_list");
        let hasCategory = false;
        if (categoryList) {
            const parsedCategoryList = JSON.parse(categoryList);
            Object.keys(parsedCategoryList).forEach(category => {
                if (parsedCategoryList[category].chats.includes(this.currentChat)) {
                    select.value = category;
                    hasCategory = true;
                }
            });
        }
        if (!hasCategory) {
            select.value = "No Category";
        }

        select.addEventListener('change', (e) => {
            e.target.value
            //Check if the category exists
            let category_list = localStorage.getItem("category_list");
            category_list = category_list ? JSON.parse(category_list) : {};
            // Cleaning the current chat from any category
            Object.keys(category_list).forEach(category => {
                const index = category_list[category].chats.indexOf(this.currentChat);
                if (index !== -1) {
                    category_list[category].chats.splice(index, 1);
                }
            });
            // Adding the chat to the new category
            if(e.target.value in category_list){
                // Add the chat to the category
                category_list[e.target.value].chats.push(this.currentChat);
            }
            else if(e.target.value == "No Category"){

            }
            else{
                // Create the category
                category_list[e.target.value] = {color:this.cat_definitions[e.target.value],chats:[this.currentChat]};
            }
            localStorage.setItem("category_list",JSON.stringify(category_list));
            // TODO Please, this needs to be temporal
            this.improved_chat_list.remove();
            this.improved_chat_list = document.createElement('span');
            this.improved_chat_list.id = "improved-chat-list";
            this.improved_chat_list.innerHTML = '<div class="relative mt-5" data-projection-id="7" style="height: auto; opacity: 1;"></div>';
            this.chat_list.appendChild(this.improved_chat_list);
            this.renderChats();
        });
        topbar.appendChild(select);
        
    }

    async init(){
        this.chat_list = document.querySelector('div.flex.flex-col.gap-2.pb-2.dark\\:text-gray-100.text-gray-800.text-sm > div')
        this.chat_list.children[0].id = "chat-list";
        this.chat_list.children[0].style.display = "none";
        this.improved_chat_list = document.createElement('span');
        this.improved_chat_list.id = "improved-chat-list";
        this.improved_chat_list.innerHTML = '<div class="relative mt-5" data-projection-id="7" style="height: auto; opacity: 1;"></div>';
        this.chat_list.appendChild(this.improved_chat_list);
        //console.log(localStorage.getItem("accessToken"));
        this.saveElementReferences();
        //this.chat_list.innerHTML = "";
        //this.chats = await API.GET('https://chat.openai.com/backend-api/conversations',{Authorization: localStorage.getItem("accessToken")});
        console.log(this.chats);
        this.renderChats();
        this.addCategorySelect();
        //this.chat_list.appendChild(await this.createChatListCategory(this.chats.items));
        
    }
}
export default Folders;
