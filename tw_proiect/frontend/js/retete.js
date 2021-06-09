import { sendAlert } from './utils/error_handling.js'

let retete = document.getElementsByClassName("card-wrapper")[0]

let data = window.location.search.split("?")[1];

let [data2, data3] = window.location.search.split("=");
import { add_card } from './recipe_card.js'

//console.log(auth)
//console.log(key)
let filterCookie = ""
//console.log(data)
if (data !== undefined) {
    filterCookie = '{"' + decodeURI(data).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}'
    filterCookie = JSON.parse(filterCookie)
}

//console.log(filterCookie)
function showFilters(filters){
    
    let element=document.getElementsByName("diff_easy")[0]
    if (filters.diff_easy==="1"){
        element.checked=true
    }
    element=document.getElementsByName("diff_medium")[0]
    if (filters.diff_medium==="1"){
        element.checked=true
    }

    element=document.getElementsByName("diff_hard")[0]
    if (filters.diff_hard==="1"){
        element.checked=true
    }
    element=document.getElementsByName("diff_master")[0]
    if (filters.diff_master==="1"){
        element.checked=true
    }

    //--
    element=document.getElementsByName("include")[0]
    if (filters.include!==""){
        element.value=decodeURIComponent(filters.include).replace(/\+/g, " ")//.replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"')
    }
    element=document.getElementsByName("exclude")[0]
    if (filters.exclude!==""){
        element.value=decodeURIComponent(filters.exclude).replace(/\+/g, " ")//.replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"')
    }
    // element=document.getElementsByName("diff_hard")[0]
    // if (filters.diff_hard==="1"){
    //     element.checked=true
    // }
    element=document.getElementsByName("time_min_value")[0]
    if (filters.time_min_value!==""){
        element.value=filters.time_min_value
    }

    element=document.getElementsByName("time_min_unit")[0]
    if (filters.time_min_unit!==""){
        element.value=filters.time_min_unit
    }

    element=document.getElementsByName("time_max_value")[0]
    if (filters.time_max_value!==""){
        element.value=filters.time_max_value
    }

    element=document.getElementsByName("time_max_unit")[0]
    if (filters.time_max_unit!==""){
        element.value=filters.time_max_unit
    }

    element=document.getElementsByName("time_max_unit")[0]
    if (filters.time_max_unit!==""){
        element.value=filters.time_max_unit
    }

    element=document.getElementsByName("order_by")[0]
    if (filters.order_by!==""){
        element.value=filters.order_by
    }

    element=document.getElementsByName("order")[0]
    if (filters.order!==""){
        element.value=filters.order
    }
}

window.onload = function () {
    if (localStorage.getItem("AuthorizationToken") === null) {
        if  (localStorage.getItem("filter")!==null){
            let filtre=JSON.parse(localStorage.getItem("filter"))
            showFilters(filtre)
        }
    }
    else {

        let getFilterData = "http://localhost:5000/getFilter"

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    let data = JSON.parse(this.response)
                    //console.log(data)
                    showFilters(data)
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
    //console.log(filterCookie)
    if (localStorage.getItem("AuthorizationToken") === null) {
        localStorage.setItem("filter", JSON.stringify(filterCookie))
    }
    else {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    console.log("okay")

                }
                else {
                    console.log("eroare")
                }
            }
        }
        let link = "http://localhost:5000/insertFilter"
        xhttp.open("POST", link, false);
        xhttp.setRequestHeader("Authorization", localStorage.getItem("AuthorizationToken"))
        xhttp.send(JSON.stringify(filterCookie));

    }
    request_at(request_link)
    //request_at(getFilterData)
} else {
    let request_link = "http://localhost:5000/recipes"
    request_at(request_link)
}
function request_at(link) {
    let type = link.split('?')[0].split('/')
    type = type[type.length - 1]
    //console.log(type)

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