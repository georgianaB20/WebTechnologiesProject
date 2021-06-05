import { images_server_url } from './utils/constants.js'

export function add_card(recipe, HTML_element) {
    console.log(recipe)
    let descr = "";
    console.log(recipe)
    if (recipe.description.length > 100)
        descr = recipe.description.substring(0, 100) + "...";
    else
        descr = recipe.description + "...";

    if (recipe.time < 60) {
        recipe.time = recipe.time.toString() + " min"
    } else if (recipe.time < 24 * 60) {
        recipe.time = recipe.time.toString() + " h"
    } else {
        recipe.time = recipe.time.toString() + " d"
    }

    HTML_element.innerHTML += `<a href="reteta.html?id=${recipe._id}">
                <div class="card">
                    <img src='${images_server_url}?${recipe.picture}' alt=${recipe.title} class="card-img">
                    <h2>${recipe.title}</h2>
                    <p class="descriere">
                        ${descr}
                    </p>
                    <div class="filtre">
                        <div class="time bg">
                            <i class="far fa-clock"></i>
                            <span class="txt">${recipe.time}</span>
                        </div>
                        <div class="dificultate bg">
                            <i class="fab fa-gripfire"></i>
                            <span class="txt">${recipe.difficulty}</span>
                        </div>
                        <div class="popularitate bg">
                            <i class="far fa-comments"></i>
                            <span class="txt">${recipe.comments.length}</span>
                        </div>
                    </div>
                </div>
            </a>`
}