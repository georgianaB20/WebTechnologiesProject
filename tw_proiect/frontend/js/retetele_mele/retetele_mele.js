import { retetele_mele_card } from '../recipe_card.js'
import {sendAlert} from '../utils/error_handling.js'

let retete = document.getElementsByClassName("containerRetete")[0]


if (localStorage.getItem("AuthorizationToken") !== null) {
    
    let xhttp = new XMLHttpRequest()

    xhttp.open("GET", "http://localhost:5000/recipes/user");
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.setRequestHeader("Accept", "application/json");
    xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
    xhttp.setRequestHeader("Authorization", localStorage.getItem('AuthorizationToken'))

    xhttp.onload = function () {
        if (this.status == 200) {
            // change_heart()
            // alert(JSON.parse(this.response).message)
            let recipes = JSON.parse(this.response)
            recipes.forEach(recipe => {
                retetele_mele_card(recipe, retete)
            });

            recipes.forEach(recipe => {
                document.getElementById("delete_" + recipe._id.toString()).addEventListener('click', deleteRecipe)
            })


        } else {
            alert(JSON.parse(this.response).message)
        }
    }
    xhttp.send();
} else {
    retete.innerHTML += "Unauthorized"
}

function deleteRecipe(delete_button) {
    let id = delete_button.path[0].id.split("_")[1]
    let link = "http://localhost:5000/recipe?recipe_id=" + id

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.status == 200 && this.readyState == 4) {
            // let arr = JSON.parse(this.response)
            // arr.forEach(element => {
            //     // favorite_card(element, card_wrapper)
            // });
        }
        if (this.status === 401 || this.status === 403 || this.status === 404 || this.status === 500) {//la 401 este nume sau parola gresita
            ///window.location.href = './error'+JSON.stringify(req.status)+'.html'//ne ducem in eroarea pe care o primim
            let message=""
            sendAlert(message, JSON.stringify(this.status))
        }
    }
    xhttp.open("DELETE", link, true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.setRequestHeader("Accept", "application/json");
    xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
    xhttp.setRequestHeader("Authorization", localStorage.getItem('AuthorizationToken'))
    xhttp.send();
}