var fav_button = document.getElementsByClassName("fas fa-heart")[0]
    // console.log(typeof fav_button)
fav_button.addEventListener('click', addToFavorites)
    //     //     event.preventDefault()
    //     //     console.log("hollaaaa")
    //     // });
    //     // console.log(fav_button.onclick)

function addToFavorites() {
    // event.preventDefault()
    console.log("AM AJUNS")
}
//console.log(fav_button.innerHTML)
// var rid = window.location.search.split("=")[1]

// if (!window.localStorage.authorization) {
//     let favorites = localStorage.getItem('favorites')
//     let recipe = 
//     favorites.push
// } else {

//     var xhttp = new XMLHttpRequest();
//     xhttp.onreadystatechange = function() {

//     }
//     xhttp.open("GET", "http://localhost:5000/recipe?id=" + id, true);
//     xhttp.send();
// }

// var search = document.getElementById("adauga_favorite");
// search.addEventListener("click", searchFct);

// function searchFct(event) {
//     if (document.getElementsByClassName("search-txt")[0].value.length > 0) {
//         console.log(document.getElementsByClassName("search-txt")[0].value)

//         let query = document.getElementsByClassName("search-txt")[0].value
//         let search_btn = document.getElementsByClassName("search-button")[0].setAttribute("href", "retete.html?search=" + query)
//     } else {
//         event.preventDefault();
//     }
//     console.log(event)
// }