import { sendAlert } from './utils/error_handling.js'

let retete = document.getElementsByClassName("card-wrapper")[0]

let data = window.location.search.split("?")[1];

let [data2, data3] = window.location.search.split("=");
import { add_card } from './recipe_card.js'

//console.log(auth)
//console.log(key)

let filterCookie = '{"' + decodeURI(data).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}'
filterCookie = JSON.parse(filterCookie)
console.log(filterCookie)

window.onload = function () {
    if (localStorage.getItem("AuthorizationToken") === null) {
        
    }
    else {

        let getFilterData = "http://localhost:5000/getFilter"

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    let data = JSON.parse(this.response)
                    console.log(data)
                }
            }
        }
        xhttp.open("GET", getFilterData, true);
        xhttp.setRequestHeader("Authorization", localStorage.getItem("AuthorizationToken"))
        xhttp.send();
    }
}



if (data2 === "?search") {
    let request_link = "http://localhost:5000/recipes?q=" + data3
    request_at(request_link)
} else if (data !== undefined) {
    let request_link = "http://localhost:5000/recipes/filter?"
    //let getFilterData = "http://localhost:5000/getFilter"
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
    //getFilterData += request_link.split('?')[1]

    request_at(request_link)
    //request_at(getFilterData)
} else {
    let request_link = "http://localhost:5000/recipes"
    request_at(request_link)
}
function request_at(link) {
    let type = link.split('?')[0].split('/')
    type = type[type.length - 1]
    console.log(type)

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                if (type === "filter" || type === "recipes") {
                    let arr = JSON.parse(this.response)
                    arr.forEach(element => {
                        if (element.recipe)
                            add_card(element.recipe, retete)
                        else
                            add_card(element, retete)
                    });
                }
                else {
                    let arr = JSON.parse(this.response)
                    console.log(arr)
                }
            } else {
                let resp = JSON.parse(this.response)
                if (this.status === 401 || this.status === 403 || this.status === 404 || this.status === 500) {
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