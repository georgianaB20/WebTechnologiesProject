async function handleFormSubmit(event) {

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

    req.open("PUT", url);
    req.setRequestHeader("Authorization", localStorage.getItem("AuthorizationToken"))
    req.setRequestHeader("Content-Type", "application/json");
    req.setRequestHeader("Accept", "application/json");
    req.setRequestHeader("Access-Control-Allow-Origin", "*");

    var res;

    req.onload = function() {

        if (req.status !== 200) {

            res = JSON.parse(req.response)
            if (req.status === 401 || req.status === 403 || req.status === 404 || req.status === 500) {
                ///window.location.href = './error'+JSON.stringify(req.status)+'.html'//ne ducem in eroarea pe care o primim
                sendAlert(res.message, JSON.stringify(req.status))
            }
            alert(res.message);

        } else {

            alert("Actiune efectuata cu succes.")
                //window.location.href = "./contul_meu.html"

        }

    }

    req.send(formDataJsonString);

    return res;
}


var changeUserForm = document.getElementById("change_user");
changeUserForm.addEventListener("submit", handleFormSubmit);

var changeEmailForm = document.getElementById("change_email");
changeEmailForm.addEventListener("submit", handleFormSubmit);

var changePasswordForm = document.getElementById("change_password");
changePasswordForm.addEventListener("submit", handleFormSubmit);