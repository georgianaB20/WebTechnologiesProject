import {sendAlert} from '../utils/error_handling.js'
export async function handleFormSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;

    const url = form.action;

    try {
        const formData = new FormData(form);

        await postFormDataAsJSON({ url, formData });
    } catch (error) {
        console.error(error);
    }
}

async function postFormDataAsJSON({ url, formData }) {
    const plainFormData = Object.fromEntries(formData.entries());

    plainFormData.picture_type = plainFormData.picture.type
    var reader = new FileReader()
    reader.onload = async function (e) {

        plainFormData.picture = btoa(reader.result);

        const formDataJsonString = JSON.stringify(plainFormData);

        var req = new XMLHttpRequest()

        req.open("POST", url);

        req.setRequestHeader("Content-Type", "application/json");
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Access-Control-Allow-Origin", "*");
        req.setRequestHeader("Authorization", localStorage.getItem('AuthorizationToken'))

        req.onload = function () {
            if (req.status === 200) {
                console.log(JSON.parse(req.response)._id)
                alert("Reteta adaugata cu succes. Apasati OK pt redirectare.")
                window.location.replace("./reteta.html?id=" + JSON.parse(req.response)._id)
            } else if (req.status === 401 || req.status === 403 ||req.status === 404 ||req.status === 500){
                let message=""
                sendAlert(message,req.status)//ne ducem in eroarea pe care o primim
            }
        }
        req.send(formDataJsonString);
    }
    reader.readAsBinaryString(plainFormData.picture)

}