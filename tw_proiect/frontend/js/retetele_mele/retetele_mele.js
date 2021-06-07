import { retetele_mele_card } from '../recipe_card.js'

let retete = document.getElementsByClassName("containerRetete")[0]
    // console.log(retete)

if (localStorage.getItem("AuthorizationToken") !== null) {
    console.log("am ajuns")
    let xhttp = new XMLHttpRequest()

    xhttp.open("GET", "http://localhost:5000/recipes/user");
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.setRequestHeader("Accept", "application/json");
    xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
    xhttp.setRequestHeader("Authorization", localStorage.getItem('AuthorizationToken'))

    xhttp.onload = function() {
        console.log("in functie")
        if (this.status == 200) {
            // change_heart()
            // alert(JSON.parse(this.response).message)
            let recipes = JSON.parse(this.response)
                // console.log(recipes)
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
    console.log("DELETE")
    let id = delete_button.path[0].id.split("_")[1]
    console.log(id)
}