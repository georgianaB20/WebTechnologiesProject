import { sendAlert } from './utils/error_handling.js'

window.onload = function() {
    const xhttp = new XMLHttpRequest()

    xhttp.open('GET', 'http://localhost:5000/get_user');

    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.setRequestHeader("Accept", "application/json");
    xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");

    xhttp.setRequestHeader("Authorization", localStorage.getItem('AuthorizationToken'))

    xhttp.onload = function() {

        if (xhttp.status !== 200) {
            let res = JSON.parse(xhttp.response)
            if (req.status === 401 || req.status === 403 || req.status === 404 || req.status === 500) { //la 401 este nume sau parola gresita
                ///window.location.href = './error'+JSON.stringify(req.status)+'.html'//ne ducem in eroarea pe care o primim
                sendAlert(res.message, JSON.stringify(req.status))
            }
            //todo: de trimis alerta in fiecare eroare 
            alert(res.message);
        } else {
            let res = JSON.parse(xhttp.response)

            if (res.user_type === 'admin') {
                let admin_button = document.createElement("admin_button");
                admin_button.innerHTML += `<a href="../views/admins_page.html">
                     <button type="button" class="admin">Pagina de admin</button>
                 </a>`

                document.getElementById("formulare_configurare").appendChild(admin_button);

            }


        }
    }
    xhttp.send();
}