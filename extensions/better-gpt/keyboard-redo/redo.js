export default class KeyboardRedo{
    constructor(){
        this.promptArea = document.getElementById('prompt-textarea')
        this.init();
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
            this.saveMessage();
        } else if (event.ctrlKey && key === 90 && event.key === 'Z') {
            this.loadMessage();
        }
    }

    init(){
        this.promptArea.addEventListener('keydown',this.handleKey)
        //.addEventListener('click', handleClick);
        
    }

}