import { addToFavorites, deleteFromFavorites } from './adauga_sterge_fav.js'

let fav = document.getElementById("adauga_favorite")
console.log(fav)

if (fav.childNodes[0].className === "far fa-heart")
    fav.addEventListener("click", function1);
else if (fav.childNodes[0].className === "fas fa-heart")
    fav.addEventListener("click", function2);


function function1(event) {
    console.log("fct1")
    fav.removeEventListener("click", function1)
    fav.removeChild(fav.childNodes[0])
    let heart = document.createElement("i")
    heart.className = "fas fa-heart"
    fav.appendChild(heart)
    fav.addEventListener("click", deleteFromFavorites)
}

function function2(event) {
    console.log("fct2")
    fav.removeEventListener("click", function2)
    fav.removeChild(fav.childNodes[0])
    let heart = document.createElement("i")
    heart.className = "far fa-heart"
    fav.appendChild(heart)
    fav.addEventListener("click", addToFavorites)
}