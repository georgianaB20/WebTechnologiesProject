import { add_card } from './recipe_card.js'
import {sendAlert} from './utils/error_handling.js'

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

        arr.forEach(element => {
            add_card(element, retete)
        });
    }
	else{
		if (this.status === 401 ||this.status === 403 ||this.status === 404 ||this.status === 500){
			sendAlert(JSON.stringify(JSON.parse(this.response).message),JSON.stringify(this.status))
		}
	}
}
xhttp.open("GET", "http://localhost:5000/recipes", true);
xhttp.send();