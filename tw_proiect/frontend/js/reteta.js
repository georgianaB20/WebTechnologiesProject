import { images_server_url } from './utils/constants.js'

const queryString = window.location.search;
let id = queryString.split("=")[1]


var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    //console.log(this.readyState);
    if (this.status == 200 && this.readyState == 4) {
        let recipe = JSON.parse(this.response)

        if (recipe.time < 60) {
            recipe.time = recipe.time.toString() + " min"
        } else if (recipe.time < 24 * 60) {
            recipe.time = recipe.time.toString() + " h"
        } else {
            recipe.time = recipe.time.toString() + " d"
        }

        let element = document.getElementsByTagName("title")[0]
        element.innerHTML = `${recipe.title}`
        element = document.getElementById("recipe_title")
            // console.log(element.innerHTML)
        element.innerHTML += `<h1>${recipe.title}</h1>` //+ element.innerHTML
            // console.log(element.innerHTML)

        element = document.getElementById("time")
        element.innerHTML += `<span class="txt">${recipe.time}</span>`
        element = document.getElementById("dificultate")
        element.innerHTML += `<span class="txt">${recipe.difficulty}</span>`
        element = document.getElementById("popularitate")
        element.innerHTML += `<span class="txt">${recipe.comments.length}</span>`
        element = document.getElementById("ingrediente")
            // console.log(recipe.ingredients)
        recipe.ingredients.forEach(ingredient => {
            element.innerHTML +=
                `<li>
                    <div class="container-ingredient">
                        <div class="ingredient">
                            <span class="numele-ingheientului">${ingredient}</span>
                        </div>
                    </div>
                </li>`
        });
        element = document.getElementById("instructiuni")
        element.innerHTML += `<p class="pasi">${recipe.description}</p>`
            // console.log(recipe)

        element = document.getElementById("imagine-reteta")
        element.innerHTML = `<img class="img" src='${images_server_url}?${recipe.picture}' alt="Poza a retetei 1">`
    }
}

xhttp.open("GET", "http://localhost:5000/recipe?id=" + id, true);
xhttp.send();

var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function() {
        this.classList.toggle("active");
        var content = this.nextElementSibling;
        if (content.style.display === "block") {
            content.style.display = "none";
        } else {
            content.style.display = "block";
        }
    });
}


var fav_button = document.getElementById("adauga_favorite")
fav_button.addEventListener("click", addToFavorites)

function addToFavorites(event) {
    event.preventDefault()
    console.log("AM AJUNS")
}