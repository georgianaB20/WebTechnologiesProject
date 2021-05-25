let retete = document.getElementsByClassName("card-wrapper")[0];
//console.log(retete[0].innerHTML)

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
                    <img src="../images/5.jpg" alt=${element.title} class="card-img">
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
xhttp.open("GET", "http://localhost:5000/recipes", true);
xhttp.send();
