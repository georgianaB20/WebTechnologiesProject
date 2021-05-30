let retete = document.getElementsByClassName("card-wrapper")[0]
    //console.log(retete[0].innerHTML)

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
    xhttp.onreadystatechange = function() {
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