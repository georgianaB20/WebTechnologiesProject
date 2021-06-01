import { images_server_url } from './utils/constants.js'

const queryString = window.location.search;
let id = queryString.split("=")[1]
    // console.log(queryString.split("=")[1]);

var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    //console.log(this.readyState);
    if (this.status == 200 && this.readyState == 4) {
        let recipe = JSON.parse(this.response)
        let element = document.getElementsByTagName("title")[0]
        element.innerHTML = `${recipe.title}`
        element = document.getElementById("recipe-info")
        element.innerHTML = `<h1>${recipe.title}</h1>` + element.innerHTML
        element = document.getElementById("time")
        element.innerHTML += `<span class="txt">${recipe.time}</span>`
        element = document.getElementById("dificultate")
        element.innerHTML += `<span class="txt">${recipe.difficulty}</span>`
        element = document.getElementById("popularitate")
        element.innerHTML += `<span class="txt">${recipe.comments.length}</span>`
        element = document.getElementById("ingrediente")
        console.log(recipe.ingredients)
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
        console.log(recipe)

        element = document.getElementById("imagine-reteta")
            // console.log(recipe.picture.ContentType)
        element.innerHTML = `<img class="img" src='${images_server_url}?${recipe.picture}' alt="Poza a retetei 1">`
    }
}
xhttp.open("GET", "http://localhost:5000/recipe?id=" + id, true);
xhttp.send();