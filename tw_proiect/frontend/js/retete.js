import {sendAlert} from './utils/error_handling.js'

let retete = document.getElementsByClassName("card-wrapper")[0]

let data = window.location.search.split("?")[1];

let [data2, data3] = window.location.search.split("=");
import { add_card } from './recipe_card.js'

if (data2 === "?search") {
    let request_link = "http://localhost:5000/recipes?q=" + data3
    request_at(request_link)
} else if (data !== undefined) {
    let request_link = "http://localhost:5000/recipes/filter?"
    let query_par = data.split("&")
    for (let i = 0; i < query_par.length; i++) {
        let name = query_par[i].split("=")[0]
        let value = query_par[i].split("=")[1]
        if (name === "exclude" || name === "include") {
            let vlist = value.split("%2C")
            let vret = ""
            for (let j = 0; j < vlist.length; j++) {
                let str = vlist[j]
                str = decodeURI(str).replace(/\+/g, " ")
                vret = vret + str.trim() + ","
            }
            value = vret.substring(0, vret.length - 1)
        }
        request_link += name + "=" + value + "&"
    }
    request_at(request_link)
} else {
    let request_link = "http://localhost:5000/recipes"
    request_at(request_link)
}
function request_at(link) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 200) {
                let arr = JSON.parse(this.response)
                arr.forEach(element => {
                    if (element.recipe)
                        add_card(element.recipe, retete)
                    else
                        add_card(element, retete)
                });
            } else {
                let resp = JSON.parse(this.response)
                if (this.status === 401 || this.status === 403 || this.status === 404 || this.status === 500) {//la 401 este nume sau parola gresita
                    let message = ""
                    sendAlert(message, JSON.stringify(this.status))
                }
                //let resp = JSON.parse(this.response)
                alert(resp.message)
                window.location.href = "./retete.html"
            }
        }
    }
    xhttp.open("GET", link, true);
    xhttp.send();
}