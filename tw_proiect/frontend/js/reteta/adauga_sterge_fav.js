var fav_button = document.getElementById("adauga_favorite")

let id = window.location.search.split("=")[1]


window.onload = function() {
    ///vedem daca reteta este la favoritele userului
    if (localStorage.getItem("AuthorizationToken") === null) {
        if (localStorage.getItem("Favorites") !== null) {
            let recipes = localStorage.getItem("Favorites").split(",")
            let found = 0
            for (let i = 0; i < recipes.length; i++) {
                if (recipes[i] === id) {
                    let heart = document.createElement("i")
                    heart.className = "fas fa-heart"
                    fav_button.appendChild(heart)
                    found = 1
                    break
                }
            }
            if (!found) {
                let heart = document.createElement("i")
                heart.className = "far fa-heart"
                fav_button.appendChild(heart)

            }
        } else {
            let heart = document.createElement("i")
            heart.className = "far fa-heart"
            fav_button.appendChild(heart)
        }

        if (fav_button.childNodes[0].className === "far fa-heart") {
            fav_button.addEventListener('click', addToFavorites)

        } else
        if (fav_button.childNodes[0].className === "fas fa-heart") {
            fav_button.addEventListener('click', deleteFromFavorites)
        }

    } else {
        let xhttp = new XMLHttpRequest()
        xhttp.open("GET", "http://localhost:5000/check_favorite?recipe_id=" + id);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.setRequestHeader("Accept", "application/json");
        xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
        xhttp.setRequestHeader("Authorization", localStorage.getItem('AuthorizationToken'))

        xhttp.onreadystatechange = function() {
            if (this.status == 200 && this.readyState == 4) {
                let message = JSON.parse(this.response).message
                if (message === "YES") {
                    let heart = document.createElement("i")
                    heart.className = "fas fa-heart"
                    fav_button.appendChild(heart)
                    fav_button.addEventListener('click', deleteFromFavorites)
                        // change_heart()
                    return;
                } else if (message === "NO") {
                    let heart = document.createElement("i")
                    heart.className = "far fa-heart"
                    fav_button.appendChild(heart)
                    fav_button.addEventListener('click', addToFavorites)
                        // change_heart()
                    return;
                }
            }
        }
        xhttp.send();

    }
}


function change_heart() {
    if (fav_button.childNodes[0].className === "fas fa-heart") {
        fav_button.removeEventListener("click", deleteFromFavorites)
        fav_button.removeChild(fav_button.childNodes[0])
        let heart = document.createElement("i")
        heart.className = "far fa-heart"
        fav_button.appendChild(heart)
        fav_button.addEventListener("click", addToFavorites)
        return;
    } else if (fav_button.childNodes[0].className === "far fa-heart") {
        fav_button.removeEventListener("click", addToFavorites)
        fav_button.removeChild(fav_button.childNodes[0])
        let heart = document.createElement("i")
        heart.className = "fas fa-heart"
        fav_button.appendChild(heart)
        fav_button.addEventListener("click", deleteFromFavorites)
        return;
    }
}



function addToFavorites(event) {
    let rid = window.location.search.split("=")[1]

    if (localStorage.getItem("AuthorizationToken") === null) { //memoram reteta la favorite in localStorage
        if (localStorage.getItem("Favorites") !== null) { //mai avem date stocate local in vectorul de favorite
            let local_favorites = localStorage.getItem("Favorites").split(",")
            if (local_favorites.length === 0) {

                local_favorites = rid
                local_favorites.push(rid)
                localStorage.removeItem("Favorites") //stergem valoarea veche din storage
                localStorage.setItem("Favorites", local_favorites.toString()) //adaugam noul array criptat in storage
                change_heart()
            } else {
                let recipe_exists = 0
                for (let i = 0; i < local_favorites.length; i++) {
                    if (local_favorites[i] === rid)
                        recipe_exists = 1
                }
                if (recipe_exists === 0) {
                    //adaugam id-ul retetei in array
                    local_favorites.push(rid)
                    localStorage.removeItem("Favorites") //stergem valoarea veche din storage
                    localStorage.setItem("Favorites", local_favorites.toString()) //adaugam noul array criptat in storage
                    change_heart()
                }

            }


        } else { //este prima reteta adaugata in localStorage
            let favorites = rid

            localStorage.setItem("Favorites", favorites)
            change_heart()
        }
    } else {
        //memoram reteta la favorite in bd
        var xhttp = new XMLHttpRequest();
        xhttp.open("PUT", "http://localhost:5000/favorites/add?recipe_id=" + id);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.setRequestHeader("Accept", "application/json");
        xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
        xhttp.setRequestHeader("Authorization", localStorage.getItem('AuthorizationToken'))

        xhttp.onload = function() {
            if (this.status == 200) {
                change_heart()
                alert(JSON.parse(this.response).message)
            } else {
                alert(JSON.parse(this.response).message)
            }
        }
        xhttp.send();
    }
}

function deleteFromFavorites(event) {
    let rid = window.location.search.split("=")[1]


    if (localStorage.getItem("AuthorizationToken") === null) { //stergem reteta din localStorage
        if (localStorage.getItem("Favorites") !== null) { //mai avem date stocate local in vectorul de favorite
            let local_favorites = localStorage.getItem("Favorites").split(",")

            let recipe_deleted = 0
            let updated_favorites = []
            for (let i = 0; i < local_favorites.length; i++) {
                if (local_favorites[i] === rid) {
                    recipe_deleted = 1
                } else
                    updated_favorites.push(local_favorites[i])
            }
            if (recipe_deleted === 1) {
                if (updated_favorites.length > 0) {
                    localStorage.removeItem("Favorites") //stergem valoarea veche din storage
                    localStorage.setItem("Favorites", updated_favorites.toString()) //adaugam noul array in storage
                    change_heart()
                } else {
                    localStorage.removeItem("Favorites")
                    change_heart()
                }
            } else {
                change_heart()
            }

        } else { //nu avem retete in localStorage
            change_heart()
        }
    } else {
        //stergem reteta de la favorite in bd
        var xhttp = new XMLHttpRequest();
        xhttp.open("PUT", "http://localhost:5000/favorites/remove?recipe_id=" + rid);

        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.setRequestHeader("Accept", "application/json");
        xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
        xhttp.setRequestHeader("Authorization", localStorage.getItem('AuthorizationToken'))

        xhttp.onload = function() {
            if (this.status == 200) {
                change_heart()
                alert(JSON.parse(this.response).message)
            } else {
                alert(JSON.parse(this.response).message)
            }
        }
        xhttp.send();

    }

}