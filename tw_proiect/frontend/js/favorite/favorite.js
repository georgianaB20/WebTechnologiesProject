import { favorite_card } from '../recipe_card.js';
import { sendAlert } from '../utils/error_handling.js'
let card_wrapper = document.getElementsByClassName("card-wrapper")[0]
let link_logged_user = "http://localhost:5000/favorites"
let link = "http://localhost:5000/recipe?id="


if (localStorage.getItem("AuthorizationToken") === null) {
    let favorite = localStorage.getItem("Favorites").split(",")
    if (favorite !== null && favorite.length > 0) {
        for (let i = 0; i < favorite.length; i++) {

            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.status == 200 && this.readyState == 4) {
                    let recipe = JSON.parse(this.response)
                    favorite_card(recipe, card_wrapper)

                } else {
                    if (this.status === 401 || this.status === 403 || this.status === 404 || this.status === 500) {
                        sendAlert(JSON.stringify(JSON.parse(this.response).message), JSON.stringify(this.status))
                    }
                }
            }
            xhttp.open("GET", link + favorite[i], true);
            xhttp.setRequestHeader("Content-Type", "application/json");
            xhttp.setRequestHeader("Accept", "application/json");
            xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
            xhttp.send();



        }
    }

} else {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.status == 200 && this.readyState == 4) {
            let arr = JSON.parse(this.response)
            arr.forEach(element => {
                favorite_card(element, card_wrapper)
            });
        } else if (this.status === 401 || /*this.status === 403 ||*/ this.status === 404 || this.status === 500) { //la 403 =cand nu esti logat, dar poti pastra favoritele si daca nu esti logat
            sendAlert(JSON.stringify(JSON.parse(this.response).message), JSON.stringify(this.status))
        }

    }
    xhttp.open("GET", link_logged_user, true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.setRequestHeader("Accept", "application/json");
    xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
    xhttp.setRequestHeader("Authorization", localStorage.getItem('AuthorizationToken'))
    xhttp.send();
}