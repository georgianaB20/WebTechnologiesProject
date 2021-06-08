
async function handleFormSubmit(event) {

    event.preventDefault();
    console.log("bn varule")
    const form = event.currentTarget;

    const url = form.action;

    try {

        const formData = new FormData(form);

        var res = await postFormDataAsJSON({ url, formData });

        //console.log(res)
        //console.log("am apelat postdataasJOSON")

    } catch (error) {

        console.error(error);

    }

}

async function postFormDataAsJSON({ url, formData }) {

    const plainFormData = Object.fromEntries(formData.entries());

    const formDataJsonString = JSON.stringify(plainFormData);
    //console.log(formDataJsonString)
    //console.log(url)
    const req = new XMLHttpRequest()

    req.open("PUT", url);
    req.setRequestHeader("Authorization",localStorage.getItem("AuthorizationToken"))
    req.setRequestHeader("Content-Type", "application/json");
    req.setRequestHeader("Accept", "application/json");
    req.setRequestHeader("Access-Control-Allow-Origin", "*");

    var res;

    req.onload = function () {

        console.log(req.status)
        if (req.status !== 200) {

            res = JSON.parse(req.response)
            alert(res.message);

        }
        else {

            //console.log("gata am schimbat user")
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
