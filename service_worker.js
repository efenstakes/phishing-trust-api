chrome.runtime.onInstalled.addListener(init);

chrome.runtime.onMessage.addListener((message, sender, sendMessage)=> {

    console.log('====================================');
    console.log(`Service Worker Got message ${message}`);
    console.log('====================================');
})

chrome.tabs.onUpdated.addListener(async (tabId, info, tab)=> {

    if( !tab.url ) {

        console.log('====================================');
        console.log("no tab url here, tab info is ", tab);
        console.log('====================================');

        return
    }

    // get url
    const url = tab?.url

    // get info about the site
    
    // send info to ui
    chrome.runtime.sendMessage({ site: url, data: "Nothing Mate", })
})

function init() {}

const getSitePhishingInfo = (site)=> {

}