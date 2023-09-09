document.addEventListener("DOMContentLoaded", init);

function init() {

    const btn = document.getElementsByClassName("testb")[0]

    btn.addEventListener('click', ()=> {

        console.log('====================================');
        console.log("button clicked");
        console.log('====================================');

        chrome.runtime.sendMessage("HolaServiceWorker")
    })

}


// listen for service worker messages
chrome.runtime.onMessage.addListener((message, sender, sendMessage)=> {

    console.log('====================================');
    console.log("UI Got message", message);
    console.log('====================================');

    console.log('====================================');
    console.log("UI Got sender ", sender);
    console.log('====================================');
})

