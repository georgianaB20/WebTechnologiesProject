import { sendAlert } from '../utils/error_handling.js'
export async function handleFormSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;

    const url = form.action;

    try {
        const formData = new FormData(form);

        var res = await postFormDataAsJSON({ url, formData });

        console.log(res)
    } catch (error) {
        console.error(error);
    }
}

async function postFormDataAsJSON({ url, formData }) {
    const plainFormData = Object.fromEntries(formData.entries());

    console.log(plainFormData)

    plainFormData.picture_type = plainFormData.picture.type

    plainFormData.rid = window.location.search.split('=')[1]

    var reader = new FileReader()
    reader.onload = async function (e) {
        plainFormData.picture = btoa(reader.result)

        const formDataJsonString = JSON.stringify(plainFormData);

        const req = new XMLHttpRequest()

        req.open("POST", url);

        req.setRequestHeader("Content-Type", "application/json");
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Access-Control-Allow-Origin", "*");
        req.setRequestHeader("Authorization", localStorage.getItem('AuthorizationToken'))
        var res;

        req.onload = function () {
            if (req.status !== 200) {
                res = JSON.parse(req.response)
                if (req.status === 403 || req.status === 404 || req.status === 500) {
                    sendAlert(JSON.stringify(res.message), JSON.stringify(req.status))
                }
                else {
                    alert(res.message);
                }
            }
            else {
                res = JSON.parse(req.response)
                window.location.href = `./reteta.html?id=${plainFormData.rid}`
            }
        }
        req.send(formDataJsonString);
    }
    reader.readAsBinaryString(plainFormData.picture)
    return res;

}

