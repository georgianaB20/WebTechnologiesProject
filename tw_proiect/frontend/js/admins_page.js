document.getElementById("ofera_comentarii").addEventListener("click", add_right_comment);
document.getElementById("restrictioneaza_comentarii").addEventListener("click", remove_right_to_comment);
document.getElementById("ofera_retete").addEventListener("click", add_right_recipes);


function add_right_comment(event) {
    // console.log("poti adauga comntarii")
    event.preventDefault();
    let user = document.getElementById("username_comentarii").value;
    let email_user = document.getElementById('email_comentarii').value;
    let parola_admin = document.getElementById("parola_admin_comentarii").value

    let body = {
        "username": `${user}`,
        "email_user": `${email_user}`,
        "parola_admin": `${parola_admin}`
    }

    console.log(body)

    const xhttp = new XMLHttpRequest()

    xhttp.open('PUT', 'http://localhost:5000/grant?type=comments');

    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.setRequestHeader("Accept", "application/json");
    xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
    xhttp.setRequestHeader("Authorization", localStorage.getItem('AuthorizationToken'));

    xhttp.onload = function () {
        let res = JSON.parse(xhttp.response)
        if (xhttp.status !== 200) {
            alert(res.message);
        } else {
            alert(res.message)
        }
    }
    xhttp.send(JSON.stringify(body))
}

function remove_right_to_comment(event) {
    event.preventDefault();
    let user = document.getElementById("username_comentarii").value;
    let email_user = document.getElementById('email_comentarii').value;
    let parola_admin = document.getElementById("parola_admin_comentarii").value

    let body = {
        "username": `${user}`,
        "email_user": `${email_user}`,
        "parola_admin": `${parola_admin}`
    }

    console.log(body)

    const xhttp = new XMLHttpRequest()

    xhttp.open('PUT', 'http://localhost:5000/restrict?type=comments');

    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.setRequestHeader("Accept", "application/json");
    xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
    xhttp.setRequestHeader("Authorization", localStorage.getItem('AuthorizationToken'));

    xhttp.onload = function () {
        let res = JSON.parse(xhttp.response)
        if (xhttp.status !== 200) {
            alert(res.message);
        } else {
            alert(res.message)
        }
    }
    xhttp.send(JSON.stringify(body))
}


function add_right_recipes(event) {
    // console.log("poti adauga comntarii")
    event.preventDefault();
    let user = document.getElementById("username_retete").value;
    let email_user = document.getElementById('email_retete').value;
    let parola_admin = document.getElementById("parola_admin_retete").value

    let body = {
        "username": `${user}`,
        "email_user": `${email_user}`,
        "parola_admin": `${parola_admin}`
    }

    console.log(body)

    const xhttp = new XMLHttpRequest()

    xhttp.open('PUT', 'http://localhost:5000/grant?type=post');

    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.setRequestHeader("Accept", "application/json");
    xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
    xhttp.setRequestHeader("Authorization", localStorage.getItem('AuthorizationToken'));

    xhttp.onload = function () {
        let res = JSON.parse(xhttp.response)
        if (xhttp.status !== 200) {
            alert(res.message);
        } else {
            alert(res.message)
        }
    }
    xhttp.send(JSON.stringify(body))
}