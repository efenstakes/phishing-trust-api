document.addEventListener("DOMContentLoaded", init);



function init() {

    console.log('====================================');
    console.log("location ", window.location);
    console.log('====================================');

    const reportForm = document.querySelector(".report_form")
    const submitReportButton = document.querySelector(".report_form_button")
    const showReportBtn = document.querySelector(".show_report_button")
    const commentInput = document.querySelector(".report_form_input")
    const reportSuccessful = document.querySelector(".report_successful")

    reportForm.style.display = 'none'
    reportForm.style.display = 'none'
    reportSuccessful.style.display = 'none'


    // show form
    showReportBtn.addEventListener('click', async ()=> {

        reportForm.style.display = 'block'
        showReportBtn.style.display = 'none'

        console.log('====================================');
        console.log("show the form now clicked");
        console.log('====================================');
    })

    // when submit report form is clicked
    submitReportButton.addEventListener('click', async ()=> {

        // get text in the comment textarea
        const comment = commentInput.value

        console.log('====================================');
        console.log("comment ", comment);
        console.log('====================================');

        // get current url
        const response = await chrome.runtime.sendMessage({ action: 'GET_URL' })

        if( Object.keys(response).includes('url') ) {

            console.log('====================================');
            console.log("we have a url ", response, "  show the form now ");
            console.log('====================================');

            // disable button
            submitReportButton.setAttribute('disabled', true)
            submitReportButton.textContent = "Reporting this site.."


            // submit the report
            const submitResponse = await chrome.runtime.sendMessage({ action: 'SUBMIT_REPORT', comment, url: response?.url, })

            console.log('====================================');
            console.log("submitResponse ", submitResponse);
            console.log('====================================');

            // show report successful container
            reportSuccessful.style.display = 'flex'
        }

        // hide report form
        reportForm.style.display = 'none'
    })
}
