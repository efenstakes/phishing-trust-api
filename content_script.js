const unsafeIconUrl = "https://avabusiness.s3.amazonaws.com/1692880506453.NovaEs.jpg"
const safeIconUrl = "https://avabusiness.s3.amazonaws.com/1692880506453.NovaEs.jpg"




// api calls


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



// dom elements

const buildStateIcon = (success = true) => {

    const iconUrl = success ? safeIconUrl : unsafeIconUrl
    const bg = success ? '#459451' : '#F29422'

    return `
        <div
            class="container_base pg_no_phishing_details"
            style="height: 44px; width: 44px; background-color: ${bg}; color: white; border-radius: 50%; z-index: 11111; position: fixed; bottom: 4%; right: 2%; display: flex; flex-direction: column; justify-content: center; align-items: center;"
        >
            <img
                src=${iconUrl}
                style="height: 36px; width: 36px; border-radius: 50%;"
            />
        </div>
    `
}


const buildNoReportsElement = ()=> {

    return `
        <div style="width: 120px; background-color: #459451; color: whitesmoke; font-weight: 600; border-radius: 6px; padding: 1rem; text-align: center; z-index: 100; position: fixed; bottom: 2%; right: 10%; display: flex; flex-direction: column; gap: 1rem;">
            No reports for this site.
        </div>
    `
}


const buildReportsElement = (analytics)=> {

    if( !analytics ) {

        return buildNoReportsElement()
    }

    const { verified, anonymous } = analytics
    const isSafe = verified === 0 && anonymous === 0

    const bgColor = isSafe ? '#459451' : '#F29422'    
    return `
        <div
            style="background-color: ${bgColor}; color:white; border-radius:12px; padding: .5rem; z-index:111110; position:fixed; bottom: 2%; right: 10%; display: flex; flex-direction: row; gap: 1rem;"
        >

            <!-- how many reports by logged in users -->
            <div style="width: 100px; padding: .5rem 1rem; background-color: white; color: ${bgColor}; border-radius: 8px;">

                <h2 style="margin: 0; padding: 0; font-weight: 600;">
                    ${verified}
                </h2>

                <p style="margin: 0; padding: 0; margin-top: -.5rem;">
                    <small>
                        Verified
                    </small>
                </p>

            </div>

            <!-- how many reports by anonymous users -->
            <div style="width: 100px; padding: .5rem 1rem; background-color: white; color: ${bgColor}; border-radius: 8px;">

                <h2 style="margin: 0; padding: 0; font-weight: 600;">
                    ${anonymous}
                </h2>

                <p style="margin: 0; padding: 0; margin-top: -.5rem;">
                    <small>
                        Anonymous
                    </small>
                </p>

            </div>


            <!-- total reports -->
            <div style="width: 100px; padding: .5rem 1rem; background-color: white; color: ${bgColor}; border-radius: 8px;">

                <h2 style="margin: 0; padding: 0; font-weight: 600;">
                    ${ verified + anonymous }
                </h2>

                <p style="margin: 0; padding: 0; margin-top: -.5rem;">
                    <small>
                        Total
                    </small>
                </p>

            </div>


            <!-- link to see all reports in our site -->
        </div>
    `
}



(
    async()=> {

        console.log('====================================');
        console.log("loaded service worker ", window.location);
        console.log('====================================');


        const isHttps = window.location?.protocol === "https:"
        const url = window.location?.origin

        if( !isHttps ) {

            console.log('====================================');
            console.log("not safe here");
            console.log('====================================');

            return
        }

        console.log('====================================');
        console.log("safe here get info for ", url);
        console.log('====================================');

        const response = await getSitePhishingInfo(url)


        // create icon
        const iconInnerHtml = buildStateIcon(response == null)
        const icon = document.createElement('div')
        icon.innerHTML = iconInnerHtml

        // add it to page
        document.body.prepend(icon)

        // create detail view
        const detailsInnerHtml = buildReportsElement(response)
        const details = document.createElement('div')
        details.innerHTML = detailsInnerHtml
        // details.style.transform = "scale(0)"
        details.style.opacity = 0
        
        // add it to page
        document.body.prepend(details)

        
        icon.addEventListener('click', ()=> {

            console.log('====================================');
            console.log("content script ===> clicked icon")
            console.log('====================================');

            const currentOpacity = window.getComputedStyle(details).opacity

            console.log('====================================');
            console.log("currentOpacity ", currentOpacity);
            console.log('====================================');

            // details.style.transform = "scale(1)"
            details.style.opacity = currentOpacity == 0 ? 1 : 0
        })



        console.log('====================================');
        console.log("response from service worker in content script ", response);
        console.log('====================================');

    }
)()
