export default class KeyboardRedo{
    constructor(){
        this.promptArea;
        this.sendButton;
        // Setting an interval to readd the event listener every 5 seconds
        setInterval(() => {
            try{
                this.init();
            }catch(e){
                // Nothing to do
            }
        }, 2000);
    }    

    saveMessage(){
        localStorage.setItem("lastMessage",this.promptArea.value);
    }

    loadMessage(){
        this.promptArea.value = localStorage.getItem("lastMessage");
    }

    handleKey(event){
        var key = event.which || event.keyCode;
        if ((event.keyCode === 13 || event.which === 13) && !event.shiftKey && !event.ctrlKey && !event.altKey) {
            // Enter pressed
            this.saveMessage();
        } else if (event.ctrlKey && key === 90 && event.key === 'Z') {
            // CTRL + SHIFT + Z pressed
            this.loadMessage();
        }
    }

    handleClick(){
        this.saveMessage();
    }

    init(){
        this.promptArea = document.getElementById('prompt-textarea');
        this.sendButton = document.querySelector("div.w-full.pt-2.md\\:pt-0.dark\\:border-white\\/20.md\\:border-transparent.md\\:dark\\:border-transparent.md\\:w-\\[calc\\(100\\%-\\.5rem\\)\\] > form > div > div > div > button");
        // Overriding the event listeners
        this.promptArea.onkeydown=this.handleKey.bind(this);
        this.sendButton.onclick=this.handleClick.bind(this)
    }

}