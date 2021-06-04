import { images_server_url } from './utils/constants.js'

const queryString = window.location.search;
let id = queryString.split("=")[1]
// console.log(queryString.split("=")[1]);

var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function () {
    //console.log(this.readyState);
    if (this.status == 200 && this.readyState == 4) {
        let recipe = JSON.parse(this.response)
        let element = document.getElementsByTagName("title")[0]

        if (recipe.time < 60) {
            recipe.time = recipe.time.toString() + " min"
        } else if (recipe.time < 24 * 60) {
            recipe.time = recipe.time.toString() + " h"
        } else {
            recipe.time = recipe.time.toString() + " d"
        }

        //punem titlul
        element.innerHTML = `${recipe.title}`
        element = document.getElementById("recipe-info")
        element.innerHTML = `<h1>${recipe.title}</h1>` + element.innerHTML

        //punem timpul
        element = document.getElementById("time")
        element.innerHTML += `<span class="txt">${recipe.time}</span>`

        //punem dificultatea
        element = document.getElementById("dificultate")
        element.innerHTML += `<span class="txt">${recipe.difficulty}</span>`

        //punem popularitatea
        element = document.getElementById("popularitate")
        element.innerHTML += `<span class="txt">${recipe.comments.length}</span>`

        //punem ingredientele
        element = document.getElementById("ingrediente")
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

        //punem instructiunile de preparare
        element = document.getElementById("instructiuni")
        element.innerHTML += `<p class="pasi">${recipe.description}</p>`

        //punem imaginea
        element = document.getElementById("imagine-reteta")
        element.innerHTML = `<img class="img" src='${images_server_url}?${recipe.picture}' alt="Poza a retetei 1">`

        //adaugam linkul la add_comment
        element = document.getElementById("add_comment")
        element.setAttribute('href', `/comentarii.html?recipe_id=${recipe._id}`)

        //adaugam comentariile
        element = document.getElementById("comment_list")
        element.innerHTML = recipe.comments.reduce(function (innerHTML, comment) {
            return innerHTML +
                `<div class="comment">
        <h3 class="nume">${comment.username}</h3>
        <p class="comment-text">${comment.text}</p>
        <div class="comm">
            <button type="button" class="collapsible">Vezi poza</button>
            <div class="content">
                <img class="coment-img" src="${images_server_url}?${comment.picture}" alt="poza din cometariu">
            </div>
        </div>
      </div>`
        }, element.innerHTML)

        var coll = document.getElementsByClassName("collapsible");
        var i;

        for (i = 0; i < coll.length; i++) {
            coll[i].addEventListener("click", function () {
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

    }
}
xhttp.open("GET", "http://localhost:5000/recipe?id=" + id, true);
xhttp.send();