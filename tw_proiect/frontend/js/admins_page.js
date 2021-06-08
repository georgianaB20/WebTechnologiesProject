document.getElementById("ofera_comentarii").addEventListener("click", add_right_comment);
document.getElementById("restrictioneaza_comentarii").addEventListener("click", remove_right_to_comment);

document.getElementById("ofera_retete").addEventListener("click", add_right_recipes);
document.getElementById("restrictioneaza_retete").addEventListener("click", remove_right_recipe);

document.getElementById("ofera_acces").addEventListener("click", add_right_access);
document.getElementById("restrictioneaza_acces").addEventListener("click", remove_right_access);

document.getElementById("ofera_mod").addEventListener("click", add_mod);
document.getElementById("restrictioneaza_mod").addEventListener("click", remove_mod);


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
            if (xhttp.status === 401 ||xhttp.status === 403 ||xhttp.status === 404 ||xhttp.status === 500){
                sendAlert(JSON.stringify(res.message),JSON.stringify(xhttp.status))
            }
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
            if (xhttp.status === 401 ||xhttp.status === 403 ||xhttp.status === 404 ||xhttp.status === 500){
                sendAlert(JSON.stringify(res.message),JSON.stringify(xhttp.status))
            }
            alert(res.message);
        } else {
            
            alert(res.message)
        }
    }
    xhttp.send(JSON.stringify(body))
}

function add_right_recipes(event) {
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
            if (xhttp.status === 401 ||xhttp.status === 403 ||xhttp.status === 404 ||xhttp.status === 500){
                sendAlert(JSON.stringify(res.message),JSON.stringify(xhttp.status))
            }
            alert(res.message);
        } else {
            
            alert(res.message)
        }
    }
    xhttp.send(JSON.stringify(body))
}

function remove_right_recipe(event) {
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

    xhttp.open('PUT', 'http://localhost:5000/restrict?type=post');

    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.setRequestHeader("Accept", "application/json");
    xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
    xhttp.setRequestHeader("Authorization", localStorage.getItem('AuthorizationToken'));

    xhttp.onload = function () {
        let res = JSON.parse(xhttp.response)
        if (xhttp.status !== 200) {
            if (xhttp.status === 401 ||xhttp.status === 403 ||xhttp.status === 404 ||xhttp.status === 500){
                sendAlert(JSON.stringify(res.message),JSON.stringify(xhttp.status))
            }
            alert(res.message);
        } else {
            alert(res.message)
        }
    }
    xhttp.send(JSON.stringify(body))
}

function add_right_access(event) {
    event.preventDefault();
    let user = document.getElementById("username_acces").value;
    let email_user = document.getElementById('email_acces').value;
    let parola_admin = document.getElementById("parola_admin_acces").value

    let body = {
        "username": `${user}`,
        "email_user": `${email_user}`,
        "parola_admin": `${parola_admin}`
    }

    console.log(body)

    const xhttp = new XMLHttpRequest()

    xhttp.open('PUT', 'http://localhost:5000/grant?type=access');

    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.setRequestHeader("Accept", "application/json");
    xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
    xhttp.setRequestHeader("Authorization", localStorage.getItem('AuthorizationToken'));

    xhttp.onload = function () {
        let res = JSON.parse(xhttp.response)
        if (xhttp.status !== 200) {
            if (xhttp.status === 401 ||xhttp.status === 403 ||xhttp.status === 404 ||xhttp.status === 500){
                sendAlert(JSON.stringify(res.message),JSON.stringify(xhttp.status))
            }
            alert(res.message);
        } else {
            alert(res.message)
        }
    }
    xhttp.send(JSON.stringify(body))
}

function remove_right_access(event) {
    event.preventDefault();
    let user = document.getElementById("username_acces").value;
    let email_user = document.getElementById('email_acces').value;
    let parola_admin = document.getElementById("parola_admin_acces").value

    let body = {
        "username": `${user}`,
        "email_user": `${email_user}`,
        "parola_admin": `${parola_admin}`
    }

    console.log(body)

    const xhttp = new XMLHttpRequest()

    xhttp.open('PUT', 'http://localhost:5000/restrict?type=access');

    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.setRequestHeader("Accept", "application/json");
    xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
    xhttp.setRequestHeader("Authorization", localStorage.getItem('AuthorizationToken'));

    xhttp.onload = function () {
        let res = JSON.parse(xhttp.response)
        if (xhttp.status !== 200) {
            if (xhttp.status === 401 ||xhttp.status === 403 ||xhttp.status === 404 ||xhttp.status === 500){
                sendAlert(JSON.stringify(res.message),JSON.stringify(xhttp.status))
            }
            alert(res.message);
        } else {
            alert(res.message)
        }
    }
    xhttp.send(JSON.stringify(body))
}

function add_mod(event) {
    event.preventDefault();
    let user = document.getElementById("username_mod").value;
    let email_user = document.getElementById('email_mod').value;
    let parola_admin = document.getElementById("parola_admin_mod").value

    let body = {
        "username": `${user}`,
        "email_user": `${email_user}`,
        "parola_admin": `${parola_admin}`
    }

    console.log(body)

    const xhttp = new XMLHttpRequest()

    xhttp.open('PUT', 'http://localhost:5000/grant?type=moderator');

    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.setRequestHeader("Accept", "application/json");
    xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
    xhttp.setRequestHeader("Authorization", localStorage.getItem('AuthorizationToken'));

    xhttp.onload = function () {
        let res = JSON.parse(xhttp.response)
        if (xhttp.status !== 200) {
            if (xhttp.status === 401 ||xhttp.status === 403 ||xhttp.status === 404 ||xhttp.status === 500){
                sendAlert(JSON.stringify(res.message),JSON.stringify(xhttp.status))
            }
            alert(res.message);
        } else {
            alert(res.message)
        }
    }
    xhttp.send(JSON.stringify(body))
}

function remove_mod(event) {
    event.preventDefault();
    let user = document.getElementById("username_mod").value;
    let email_user = document.getElementById('email_mod').value;
    let parola_admin = document.getElementById("parola_admin_mod").value

    let body = {
        "username": `${user}`,
        "email_user": `${email_user}`,
        "parola_admin": `${parola_admin}`
    }

    console.log(body)

    const xhttp = new XMLHttpRequest()

    xhttp.open('PUT', 'http://localhost:5000/restrict?type=moderator');

    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.setRequestHeader("Accept", "application/json");
    xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
    xhttp.setRequestHeader("Authorization", localStorage.getItem('AuthorizationToken'));

    xhttp.onload = function () {
        let res = JSON.parse(xhttp.response)
        if (xhttp.status !== 200) {
            if (xhttp.status === 401 ||xhttp.status === 403 ||xhttp.status === 404 ||xhttp.status === 500){
                sendAlert(JSON.stringify(res.message),JSON.stringify(xhttp.status))
            }
            alert(res.message);
        } else {
            alert(res.message)
        }
    }
    xhttp.send(JSON.stringify(body))
}