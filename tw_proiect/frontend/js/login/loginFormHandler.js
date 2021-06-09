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

    const req = new XMLHttpRequest()

    req.open("POST", url);

    req.setRequestHeader("Content-Type", "application/json");
    req.setRequestHeader("Accept", "application/json");
    req.setRequestHeader("Access-Control-Allow-Origin", "*");

    var res;

    req.onload = function() {
        if (req.status !== 200) {
            res = JSON.parse(req.response)
                //alert(res.message);
            if ( /*req.status === 401 ||*/ req.status === 403 || req.status === 404 || req.status === 500) { //la 401 este nume sau parola gresita
                sendAlert(res.message, JSON.stringify(req.status))
            }
            if (req.status === 401)
                alert(res.message);

        } else {
            res = JSON.parse(req.response)
            localStorage.setItem("AuthorizationToken", res.Authorization)
            window.location.href = "./index.html"
        }
    }
    req.send(formDataJsonString);

    return res;
}