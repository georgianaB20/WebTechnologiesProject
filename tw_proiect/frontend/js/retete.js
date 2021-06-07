// import { filter } from './filtrare.js'

let retete = document.getElementsByClassName("card-wrapper")[0]
    //console.log(retete[0].innerHTML)
console.log(window.location.search)
let data = window.location.search.split("?")[1];
let data2 = window.location.search.split("=")[0];
import { add_card } from './recipe_card.js'


// event.preventDefault();
if (data2 === "?search") {
    console.log("search: " + data2)
    let request_link = "http://localhost:5000/search?data=" + data
    request_at(request_link)
} else if (data !== undefined) {
    //facem o functie filtrare.js pe care o voi apela aici, functia o sa parseze link ul, o sa trimita request ul la backend, si pune datele intr-un document, argumente: split dupa ?
    let request_link = "http://localhost:5000/recipes/filter?"
    //recipes/filter?diff_easy=1&diff_medium=1&diff_hard=1&diff_master=1
    let query_par = data.split("&")
        //console.log(data)
    for (let i = 0; i < query_par.length; i++) {
        //console.log(query_par[i])
        let name = query_par[i].split("=")[0]
        let value = query_par[i].split("=")[1]
        if (name === "exclude" || name === "include") {
            let vlist = value.split("%2C")
            let vret = ""
            for (let j = 0; j < vlist.length; j++) {
                let str = vlist[j]
                    //dam decode la text si facem trim pt poz actuala in vector
                str = decodeURI(str).replace(/\+/g, " ")
                vret = vret + str.trim() + ","
            }
            value = vret.substring(0, vret.length - 1)
        }
        request_link += name + "=" + value + "&"
            //console.log(request_link)
            //console.log(name, value)
    }
    //canepa%2C+ciuperci"
    console.log(request_link)
    request_at(request_link)

} else {
    console.log("most popular")
    let request_link = "http://localhost:5000/recipes"
    request_at(request_link)
}



function request_at(link) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {

        if (this.status == 200 && this.readyState == 4) {
            let arr = JSON.parse(this.response)
            arr.forEach(element => {
                add_card(element.recipe, retete)
            });
        }
    }
    xhttp.open("GET", link, true);
    xhttp.send();
}