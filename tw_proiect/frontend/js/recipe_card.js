import { images_server_url } from './utils/constants.js'

export function add_card(recipe, HTML_element) {
    let descr = "";
    if (recipe.description.length > 100)
        descr = recipe.description.substring(0, 100) + "...";
    else
        descr = recipe.description + "...";

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

    HTML_element.innerHTML += `<a href="reteta.html?id=${recipe._id}">
            <div style="padding:1rem 1rem 1rem 1rem;">
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
                </div>
            </a>`
}

export function favorite_card(recipe, HTML_element) {
    let descr = "";
    if (recipe.description.length > 100)
        descr = recipe.description.substring(0, 100) + "...";
    else
        descr = recipe.description + "...";

    HTML_element.innerHTML += `
    <a href="reteta.html?id=${recipe._id}">
    <div style="padding:1rem 1rem 1rem 1rem;">    
    <div class="card">
            <img src="${images_server_url}?${recipe.picture}" alt="${recipe.title}" class="card-img">
            <h2>${recipe.title}</h2>
            <p class="descriere">${descr}</p>
            <button class="btn">
                <i class="fas fa-heart"></i>
            </button>

        </div>
        </div>
    </a>`

}

export function retetele_mele_card(recipe, HTML_element) {
    HTML_element.innerHTML += `<div class="reteta">
            <a href="/reteta.html?id=${recipe._id}">
                <img src="${images_server_url}?${recipe.picture}" alt="${recipe.title}"></a>
            <p>${recipe.title}</p>
            <p>Popularitate:${recipe.comments.length}</p>
            <a class="submit" id="delete_${recipe._id}">Sterge</a>
        </div>`

    // <a class="submit" id="${recipe._id}">Editeaza</a>
}