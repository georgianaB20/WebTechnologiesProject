// import { filter } from './filtrare.js'
let retete = document.getElementsByClassName("card-wrapper")[0]
//console.log(retete[0].innerHTML)
console.log(window.location.search)
let data = window.location.search.split("?")[1];
let data2 = window.location.search.split("=")[0];


// event.preventDefault();
if (data2 === "?search") {
    console.log("search: " + data2)
    let request_link = "http://localhost:5000/search?data=" + data
    request_at(request_link)
}
else if (data !== undefined) {
    //facem o functie filtrare.js pe care o voi apela aici, functia o sa parseze link ul, o sa trimita request ul la backend, si pune datele intr-un document, argumente: split dupa ?
    let request_link = "http://localhost:5000/recipes/filter?"
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

}
else {
    console.log("most popular")
    let request_link = "http://localhost:5000/recipes"
    request_at(request_link)
}



function request_at(link) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        //console.log(this.readyState);
        if (this.status == 200 && this.readyState == 4) {
            //console.log(this.response)
            let arr = JSON.parse(this.response)
            arr.forEach(element => {
                console.log(element);
                let descr = "";
                if (element.description.length > 100)
                    descr = element.description.substring(0, 100) + "..."
                else
                    descr = element.description + "..."

                retete.innerHTML += `<a href="reteta.html?id=${element._id}">
                    <div class="card">
                        <img src='data:${element.picture_type};base64,${element.picture}' alt=${element.title} class="card-img">
                        <h2>${element.title}</h2>
                        <p class="descriere">
                            ${descr}
                        </p>
                        <div class="filtre">
                            <div class="time bg">
                                <i class="far fa-clock"></i>
                                <span class="txt">${element.time_value} ${element.time_unit}</span>
                            </div>
                            <div class="dificultate bg">
                                <i class="fab fa-gripfire"></i>
                                <span class="txt">${element.difficulty}</span>
                            </div>
                            <div class="popularitate bg">
                                <i class="far fa-comments"></i>
                                <span class="txt">${element.comments.length}</span>
                            </div>
                        </div>
                    </div>
                </a>`
            });
        }
    }
    xhttp.open("GET", link, true);
    xhttp.send();
}