import { favorite_card } from '../recipe_card.js';
let card_wrapper = document.getElementsByClassName("card-wrapper")[0]
let link_logged_user = "http://localhost:5000/favorites"
let link = "http://localhost:5000/recipe?id="


if (localStorage.getItem("AuthorizationToken") === null) {
    console.log("nu sunt logat")
    let favorite = localStorage.getItem("Favorites").split(",")
    if (favorite !== null && favorite.length > 0) {
        for (let i = 0; i < favorite.length; i++) {
            console.log(favorite[i])

            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                //console.log(this.readyState);
                if (this.status == 200 && this.readyState == 4) {
                    // console.log(this.response)
                    let recipe = JSON.parse(this.response)
                    favorite_card(recipe, card_wrapper)

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
        //console.log(this.readyState);
        if (this.status == 200 && this.readyState == 4) {
            // console.log(this.response)
            let arr = JSON.parse(this.response)
            arr.forEach(element => {
                // console.log(element);
                favorite_card(element, card_wrapper)
            });
        }
    }
    xhttp.open("GET", link_logged_user, true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.setRequestHeader("Accept", "application/json");
    xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
    xhttp.setRequestHeader("Authorization", localStorage.getItem('AuthorizationToken'))
    xhttp.send();
}