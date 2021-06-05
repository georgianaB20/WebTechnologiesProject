import { add_card } from './recipe_card.js'

let retete = document.getElementsByClassName("card-wrapper")[0]

let data = window.location.search.split("=")[1];
if (data !== undefined) {
    // event.preventDefault();
    console.log("search: " + data)
    let request_link = "http://localhost:5000/search?data=" + data
    request_at(request_link)
} else {
    console.log("most popular")
    let request_link = "http://localhost:5000/recipes"
    request_at(request_link)
}


function request_at(link) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.status == 200 && this.readyState == 4) {
            let arr = JSON.parse(this.response)
            arr.forEach(element => {
                add_card(element, retete)
            });
        }
    }
    xhttp.open("GET", link, true);
    xhttp.send();
}