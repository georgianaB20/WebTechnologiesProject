import { add_card } from './recipe_card.js'
import { sendAlert } from './utils/error_handling.js'
import { images_server_url } from './utils/constants.js'

let retete = document.getElementsByClassName("card-wrapper")[0];
//console.log(retete.innerHTML)
/*				<a href="reteta.html">
					<div class="card">
						<img src="../images/5.jpg" alt="poza cu reteta 5" class="card-img">
						<h2>Rețeta 5</h2>
						<p class="descriere">
							Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aut dolores ea eaque harum iste,
							natus quos repellat totam? Beatae ea exercitationem explicabo ipsa pariatur, perspiciatis
							quasi quis sapiente soluta vero!
						</p>
						<div class="filtre">
							<div class="time bg">
								<i class="far fa-clock"></i>
								<span class="txt">30min</span>
							</div>
							<div class="dificultate bg">
								<i class="fab fa-gripfire"></i>
								<span class="txt">Ușor</span>
							</div>
							<div class="popularitate bg">
								<i class="far fa-comments"></i>
								<span class="txt">30</span>
							</div>
						</div>
					</div>
				</a>
                */
var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    if (this.status == 200 && this.readyState == 4) {
        let arr = JSON.parse(this.response)
        let recipeCount = 0
        arr.forEach(element => {
            recipeCount += 1
            if (recipeCount < 5) {
                add_card(element, retete)
            }

        });
    } else {
        if (this.status === 401 || this.status === 403 || this.status === 404 || this.status === 500) {
            sendAlert(JSON.stringify(JSON.parse(this.response).message), JSON.stringify(this.status))
        }
    }
}
xhttp.open("GET", "http://localhost:5000/recipes", true);
xhttp.send();


let ranking_form = document.getElementById("ranking")
ranking_form.onsubmit = function(event) {
    event.preventDefault()
    let file_type = document.getElementById("file_type").value
    let ranking_type = document.getElementById("ranking_type").value

    let body = {
        'ranking_type': `${ranking_type}`,
        'file_type': `${file_type}`
    }

    let xhttp = new XMLHttpRequest()
    xhttp.open("PUT", "http://localhost:5000/rankings")


    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.setRequestHeader("Accept", "application/json");
    xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
    xhttp.setRequestHeader("Authorization", localStorage.getItem('AuthorizationToken'));

    xhttp.onload = function() {
        if (this.status !== 200) {
            sendAlert(JSON.stringify(JSON.parse(this.response).message), JSON.stringify(this.status))
        } else {
            let url = images_server_url + '?files/' + ranking_type + '.' + file_type
                // let a = `<a id="ancora" download href ="${url}"`
            let a = document.createElement("a")
            a.setAttribute("href", url)
            a.setAttribute("download", ranking_type + '.' + file_type)
            ranking_form.appendChild(a)
                // alert("sacasca")
            a.click()

        }
    }
    xhttp.send(JSON.stringify(body))
}