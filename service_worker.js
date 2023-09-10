
// called when extension is installed
chrome.runtime.onInstalled.addListener(()=> {

    console.log('====================================');
    console.log("installed the Phishing Guard chrome extension");
    console.log('====================================');
});



// when we get a message
chrome.runtime.onMessage.addListener( (message, _sender, sendResponse)=> {

    console.log('====================================');
    console.log("Service Worker Got message ", message);
    console.log('====================================');


    if( message?.action == 'SUBMIT_REPORT' ) {

        submitReport(message).then(sendResponse)
        return true
    }

    if( message?.action == 'GET_URL' ) {

        chrome.storage.local.get('url').then(sendResponse)
        return true
    }

    if( message?.action == 'GET_ANALYTICS' ) {

        console.log('====================================');
        console.log("get analytics at service worker");
        console.log('====================================');

        getSitePhishingInfo(message?.url).then(sendResponse)
        return true
    } 

})


// called because user clicked the extension icon
chrome.action.onClicked.addListener(async (tab) => {

    console.log('====================================');
    console.log("Service worker called because user clicked the extension icon");
    console.log('====================================');
})


// when user switches to new tab
chrome.tabs.onUpdated.addListener(async (tabId, info, tab)=> {

    if( !tab.url ) {

        console.log('====================================');
        console.log("no tab url here, tab info is ", tab);
        console.log('====================================');

        return
    }

    // get url
    const url = tab?.url

    chrome.storage.local.set({ url, });

    console.log('====================================');
    console.log("new tab url is ", url);
    console.log('====================================');
})


// submits a site report
const submitReport = async ({ comment, url, })=> {

    try {
        console.log('====================================');
        console.log("submitReport site ", url);
        console.log('====================================');
    
        const request = await fetch("http://localhost:8080/api", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `
                    mutation Report($input: CreateReportInput!) {
                        report(input: $input) {
                            _id
                            site
                            url
                            comment
                            addedOn
                        }
                    }
                `,
                variables: {
                    input: {
                        comment,
                        url,
                    },
                }
            })
        })
    
        const returnData = await request.json()
    
        console.log('====================================');
        console.log("returnData ", returnData);
        console.log('====================================');
    
        return returnData
    } catch (error) {
        
        console.log('====================================');
        console.log("error ", error);
        console.log('====================================');

        return null
    }
}

// gets analytics info for a site
const getSitePhishingInfo = async (url)=> {

    console.log('====================================');
    console.log("getSitePhishingInfo site ", url);
    console.log('====================================');

    const request = await fetch("http://localhost:8080/api", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: `
                query Analytics($url: String!) {
                    analytics(url: $url) {
                    _id
                    site
                    verified
                    anonymous
                    }
                }
            `,
            variables: {
                url,
            }
        })
    })

    const returnData = await request.json()

    console.log('====================================');
    console.log("returnData ", returnData);
    console.log('====================================');

    return returnData['data']['analytics']
}