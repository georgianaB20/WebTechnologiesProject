import { images_server_url } from '../utils/constants.js'
import {sendAlert} from '../utils/error_handling.js'

const queryString = window.location.search;
let id = queryString.split("=")[1]
    // console.log(queryString.split("=")[1]);

var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    //console.log(this.readyState);
    if (this.status == 200 && this.readyState == 4) {
        let recipe = JSON.parse(this.response)
        let element = document.getElementsByTagName("title")[0]

        if (recipe.time < 60) {
            recipe.time = recipe.time.toString() + " min"
        } else if (recipe.time < 24 * 60) {
            let t = recipe.time
            recipe.time = parseInt((recipe.time / 60).toString()).toString() + " h"
            if (t % 60 > 0)
                recipe.time += " " + (t % 60).toString() + " min"
        } else {
            let t = recipe.time
            recipe.time = parseInt((recipe.time / (24 * 60)).toString()).toString() + " d"
            if (t % (24 * 60) > 0) {
                t = t % (24 * 60)
                if (t > 60) {
                    recipe.time += " " + parseInt((t / 60).toString()).toString() + " h"
                    t = t % 60
                }
                if (t < 60) {
                    recipe.time += " " + t.toString() + " min"
                }
            }
        }

        //punem titlul
        element.innerHTML = `${recipe.title}`
        element = document.getElementById("recipe_title")
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
        element.innerHTML = recipe.comments.reduce(function(innerHTML, comment) {
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

    }
    else if (req.status === 401 ||req.status === 403 ||req.status === 404 ||req.status === 500){//la 401 este nume sau parola gresita
        ///window.location.href = './error'+JSON.stringify(req.status)+'.html'//ne ducem in eroarea pe care o primim
        sendAlert(JSON.stringify(recipe.message),JSON.stringify(req.status))
    }
}
xhttp.open("GET", "http://localhost:5000/recipe?id=" + id, true);
xhttp.send();