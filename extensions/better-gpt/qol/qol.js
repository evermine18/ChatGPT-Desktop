import API from "../requests";

export default class QOL{
    constructor(){
        this.init();
    }

    removeAllChats(){
        API.PATCH('https://chat.openai.com/backend-api/conversations',
        { is_visible: false },
        { Authorization: localStorage.getItem("accessToken") });
        window.location.reload();
    }

    renderGUI(){
        const experimentalFeatures = localStorage.getItem("experimentalFeatures");
        let margin = "70px";
        if (experimentalFeatures && experimentalFeatures === "true") {
            margin = "160px";
        }
        const deleteAllButton = document.createElement("button");
        deleteAllButton.id = "delete-all";
        deleteAllButton.textContent = "Delete all";
        deleteAllButton.className = "btn btn-danger";
        deleteAllButton.style = `position: fixed; top: 10px; right: ${margin}; z-index: 100;`;
        deleteAllButton.addEventListener("click", () => {
            this.removeAllChats();
        });
        document.body.appendChild(deleteAllButton); 
    }

    init(){
        this.renderGUI();
        document.addEventListener("keydown", function(event) {
            // Ctrl + R
            if (event.keyCode == 82 && event.ctrlKey) {
                // Reloading page
                window.location.reload();
            }
        });
        document.addEventListener("keydown", function(event) {
            // Ctrl + D
            if (event.keyCode == 68 && event.ctrlKey) {
                // Deleting all chats
                this.removeAllChats();
            }
        }.bind(this));
        
    }
}