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
    console.log(formData.entries())

    const plainFormData = Object.fromEntries(formData.entries());

    plainFormData.picture_type = plainFormData.picture.type
    var reader = new FileReader()
    reader.onload = async function (e) {

        plainFormData.picture = btoa(reader.result);

        const formDataJsonString = JSON.stringify(plainFormData);

        var req = new XMLHttpRequest()
        
        req.open("POST",url);
        
        req.setRequestHeader("Content-Type","application/json");
        req.setRequestHeader("Accept","application/json");
        req.setRequestHeader("Access-Control-Allow-Origin","*");
        req.setRequestHeader("Authorization", localStorage.getItem('AuthorizationToken'))
        
        req.onload = function() {
            if (req.status===200) {
                alert("Reteta adaugata cu succes. Apasati OK pt redirectare.")
                window.location.href="./reteta.html?id="+JSON.parse(req.response).id
            }
            else {
                if (req.status===403) {
                    alert("Nu puteti adauga retete. Contactati administratorul.")
                }
                else {
                    alert("Eroare interna! Incercati mai tarziu.")
                }
            }
        }
        req.send(formDataJsonString);
    }
    reader.readAsBinaryString(plainFormData.picture)

}