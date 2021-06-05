var fav_button = document.getElementById("adauga_favorite")
let class_name
    // console.log(fav_button.childNodes[1].className === "fas fa-heart")
if (fav_button.childNodes[0].className === "far fa-heart") {
    fav_button.addEventListener('click', addToFavorites)
    class_name = "fas"
} else if (fav_button.childNodes[0].className === "fas fa-heart") {
    fav_button.addEventListener('click', deleteFromFavorites)
    class_name = "far"
}



function addToFavorites(event) {
    // event.preventDefault()
    let rid = window.location.search.split("=")[1]

    if (localStorage.getItem("AuthorizationToken") === null) { //memoram reteta la favorite in localStorage
        if (localStorage.getItem("Favorites") !== null) { //mai avem date stocate local in vectorul de favorite
            let local_favorites = localStorage.getItem("Favorites").split(",")
            if (local_favorites.length === 0) {

                local_favorites = rid
                local_favorites.push(rid)
                localStorage.removeItem("Favorites") //stergem valoarea veche din storage
                localStorage.setItem("Favorites", local_favorites.toString()) //adaugam noul array criptat in storage
                console.log("Am adaugat in localStorage:", localStorage.getItem("Favorites"))
                class_name = "fas"
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
                    console.log("Am adaugat in localStorage:", localStorage.getItem("Favorites"))
                    class_name = "fas"
                }

            }


        } else { //este prima reteta adaugata in localStorage
            let favorites = rid
                // console.log(favorites)

            localStorage.setItem("Favorites", favorites)
            console.log("Am adaugat in localStorage:", localStorage.getItem("Favorites"))
            class_name = "fas"
        }
    } else {
        //memoram reteta la favorite in bd
        var xhttp = new XMLHttpRequest();
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.setRequestHeader("Accept", "application/json");
        xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
        xhttp.setRequestHeader("Authorization", localStorage.getItem('AuthorizationToken'))

        xhttp.open("POST", "http://localhost:5000/favorites/add?recipe_id=" + rid, true);
        xhttp.onload = function() {
            if (req.status === 200) {
                console.log(JSON.parse(req.response).message)
                alert(JSON.parse(req.response).message)
                    // window.location.replace("./reteta.html?id=" + JSON.parse(req.response)._id)
                class_name = "fas"
            } else {
                // if (req.status === 403) {
                //     alert("Nu puteti adauga retete. Contactati administratorul.")
                // } else {
                //     alert("Eroare interna! Incercati mai tarziu.")
                // }
                console.log(JSON.parse(req.response).message, req.response.status)
                alert(JSON.parse(req.response).message)
                class_name = "far"
            }
        }
        xhttp.send();
    }

    // console.log(class_name)
    console.log(fav_button.childNodes)
    if (fav_button.childNodes[0].className.split(" ")[0] === "far") {
        fav_button.removeChild(fav_button.childNodes[0])
        console.log(fav_button)
        let heart = document.createElement("i")
        heart.className = class_name + " fa-heart"
        fav_button.appendChild(heart)
        fav_button.addEventListener('click', deleteFromFavorites)

        // location.reload()
        // console.log()
        console.log(fav_button)
    }
}

function deleteFromFavorites(event) {
    console.log("AM AJUNS in delete")
    let rid = window.location.search.split("=")[1]
        // console.log(change)
    if (localStorage.getItem("AuthorizationToken") === null) { //stergem reteta din localStorage
        if (localStorage.getItem("Favorites") !== null) { //mai avem date stocate local in vectorul de favorite
            let local_favorites = localStorage.getItem("Favorites").split(",")

            if (local_favorites.length === 0) {
                class_name = "far"
                fav_button.addEventListener('click', addToFavorites)
            }

            let recipe_deleted = 0
            let updated_favorites = []
            for (let i = 0; i < local_favorites.length; i++) {
                if (local_favorites[i] === rid) {
                    recipe_deleted = 1
                        //delete local_favorites[i]
                } else
                    updated_favorites.push(local_favorites[i])
            }
            if (recipe_deleted === 1) {
                //adaugam id-ul retetei in array
                //local_favorites.push(rid)
                localStorage.removeItem("Favorites") //stergem valoarea veche din storage
                localStorage.setItem("Favorites", updated_favorites.toString()) //adaugam noul array in storage
                console.log("Am sters din localStorage:", localStorage.getItem("Favorites"))

                class_name = "far"
            } else {
                console.log("Reteta nu exista la favorite")
                class_name = "far"
            }

        } else { //nu avem retete in localStorage
            console.log('reteta nu exista in localStorage')
            class_name = "far"
        }
    } else {
        //stergem reteta de la favorite in bd
        var xhttp = new XMLHttpRequest();
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.setRequestHeader("Accept", "application/json");
        xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
        xhttp.setRequestHeader("Authorization", localStorage.getItem('AuthorizationToken'))

        xhttp.open("POST", "http://localhost:5000/favorites/remove?recipe_id=" + rid, true);
        xhttp.onload = function() {
            if (req.status === 200) {
                console.log(JSON.parse(req.response).message)
                alert(JSON.parse(req.response).message)
                    // window.location.replace("./reteta.html?id=" + JSON.parse(req.response)._id)
                class_name = "far"
            } else {
                // if (req.status === 403) {
                //     alert("Nu puteti adauga retete. Contactati administratorul.")
                // } else {
                //     alert("Eroare interna! Incercati mai tarziu.")
                // }
                console.log(JSON.parse(req.response).message, req.response.status)
                alert(JSON.parse(req.response).message)
                class_name = "far"
            }
        }
        xhttp.send();

    }

    console.log(fav_button.childNodes)
    if (fav_button.childNodes[0].className.split(" ")[0] === "fas") {
        fav_button.removeChild(fav_button.childNodes[0])
        console.log(fav_button)
        let heart = document.createElement("i")
        heart.className = class_name + " fa-heart"
        fav_button.appendChild(heart)
        fav_button.addEventListener('click', addToFavorites)
            // location.reload()
    }
}