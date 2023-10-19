var messagesCount = 50;
var messages = [];

console.log("Init");

checkSaved();
addDialog("The MessageCounter extension for GPT-4 has been initiated");

setInterval(() =>{
    let counterDiv = document.getElementById('messageCounter');
    if(isGPT4() && !counterDiv){
        const targetElm = document.querySelector('.absolute.p-1.rounded-md.md\\:bottom-3.md\\:p-2.md\\:right-3.dark\\:hover\\:bg-gray-900.dark\\:disabled\\:hover\\:bg-transparent.right-2.disabled\\:text-gray-400.enabled\\:bg-brand-purple.text-white.bottom-1\\.5.transition-colors.disabled\\:opacity-40');
        counterDiv = document.createElement('div');
        counterDiv.id = "messageCounter"
        counterDiv.className = 'absolute';
        counterDiv.style.right = '50px';
        counterDiv.style.bottom = '15px';
        counterDiv.textContent = 50-messages.length+'/50';

        targetElm.insertAdjacentElement('afterend', counterDiv);
        targetElm.addEventListener('click', handleClick);
        document.getElementById('prompt-textarea').addEventListener('keyup',handleKey)
        document.getElementById('prompt-textarea').style.width='calc(100% - 50px)';
    }
    if(counterDiv){
        garbageCollector();
        eventSet()
        counterDiv.textContent = 50-messages.length+'/50'
        if(!isGPT4()){
            counterDiv.remove();
            counterDiv!=undefined;
        }
    }
},2000);


function isGPT4(){
    const gptSelector = (document.querySelector('[data-testid="gpt-4"] button'));
    const gptTitle = document.querySelector('.flex.flex-1.flex-grow.items-center.gap-1.px-2.py-1.text-gray-600.dark\\:text-gray-200.sm\\:justify-center.sm\\:p-0');
    try {
        if (gptSelector && gptSelector.firstElementChild.classList.contains('bg-white')){
            return true;
        }else if(
            gptTitle && gptTitle.querySelector('span').textContent=='GPT-4'
            || gptTitle.querySelector('span').textContent=='Advanced Data Analysis'
            || gptTitle.querySelector('span').textContent=='Plugins'
            || gptTitle.querySelector('span').textContent=='Web Browsing'
            || gptTitle.querySelector('span').textContent=='DALL·E 3'
        ){
            return true;
        }
    } catch (error) {
        return false
    }
    
    return false
}
function handleClick(event) {
    if(event.button === 0){
        if(isGPT4()){
            messages.push(new Date().getTime());
            document.getElementById('messageCounter').textContent = 50-messages.length+'/50';
            localStorage.setItem("messages",JSON.stringify(messages))
        }
    }
}
function handleKey(event) {
    var key = event.which || event.keyCode;
    var regex = /^[\n\r]+$/;
    if ((event.keyCode === 13 || event.which === 13) && !event.shiftKey && !event.ctrlKey && !event.altKey) {
        if(isGPT4() && !regex.test(this.textContent)){
            messages.push(new Date().getTime());
            document.getElementById('messageCounter').textContent = 50-messages.length+'/50';
            localStorage.setItem("messages",JSON.stringify(messages))
        }
    }
}
function checkSaved(){  
    const messagesLS = localStorage.getItem("messages");
    if (messagesLS){
        messages= JSON.parse(messagesLS);
    }console.log(messages);
}

function garbageCollector(){
    for(let i = 0; i<messages.length;i++){
        const actualDate = new Date();
        const diferenceMS = actualDate.getTime() - messages[i];
        const diferenceHours = diferenceMS / (1000 * 60 * 60); 
        if (diferenceHours >= 3) {
            messages.splice(i,1);
            localStorage.setItem("messages",JSON.stringify(messages))
        }
    }
}

function addDialog(message){
    let spanElement = document.querySelector('span.pointer-events-none');
    var htmlContent = `<div data-state="entered" class="toast-root" style="height: 98px; margin-bottom: 0px;">
    <div class="w-full p-1 text-center md:w-auto md:text-justify">
        <div class="px-3 py-2 rounded-md text-white inline-flex flex-row border pointer-events-auto gap-2 border-green-500 bg-green-500" role="alert">
            <div class="mt-1 flex-shrink-0 flex-grow-0">
                <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
            </div>
            <div class="flex-1 justify-center gap-2">
                <div class="whitespace-pre-wrap text-left">${message}</div>
            </div>
            <div class="flex flex-shrink-0 flex-grow-0">
                <button id="cerrarAlert" aria-label="Close" class="hover:opacity-80">
                    <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
        </div>
    </div>
    </div>`;
    
    spanElement.insertAdjacentHTML('beforeend', htmlContent);
    document.getElementById('cerrarAlert').addEventListener('click',()=>{
        spanElement.removeChild(spanElement.lastChild);
    })
}

function eventSet(){
    const botonBuscado = document.querySelector('.btn.relative.btn-primary.mr-2');

    if (botonBuscado) {
        
        if (!botonBuscado.hasAttribute('data-event-added')) {
            botonBuscado.addEventListener('click', handleClick);
            botonBuscado.setAttribute('data-event-added', 'true');
        }

    }
}