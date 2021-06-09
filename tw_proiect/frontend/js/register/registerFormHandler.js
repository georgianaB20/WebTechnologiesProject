import { sendAlert } from '../utils/error_handling.js'

export async function handleFormSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;

    const url = form.action;

    try {
        const formData = new FormData(form);

        var res = await postFormDataAsJSON({ url, formData });

    } catch (error) {
        console.error(error);
    }
}

async function postFormDataAsJSON({ url, formData }) {

    const plainFormData = Object.fromEntries(formData.entries());

    const formDataJsonString = JSON.stringify(plainFormData);
    console.log(formDataJsonString)

    const req = new XMLHttpRequest()

    req.open("POST", url);

    req.setRequestHeader("Content-Type", "application/json");
    req.setRequestHeader("Accept", "application/json");
    req.setRequestHeader("Access-Control-Allow-Origin", "*");

    var res;

    req.onload = function() {
        if (req.status !== 200) {
            res = JSON.parse(req.response)
            if (req.status === 401 || req.status === 403 || req.status === 404 || req.status === 500) {
                sendAlert(res.message, JSON.stringify(req.status))
            }
        } else {
            alert("Te-ai inregistrat cu succes!")
            window.location.href = "./login.html"
        }
    }
    req.send(formDataJsonString);

    return res;
}