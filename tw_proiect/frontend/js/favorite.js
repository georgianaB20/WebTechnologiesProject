const queryString = window.location.search;
let id = queryString.split("=")[1]
console.log(id)
var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function () {
    //console.log(this.readyState);
    if (this.status == 200 && this.readyState == 4) {
        let recipes = JSON.parse(this.response)
        console.log(recipes[0]._id)
        recipes.forEach(recipe => {
            let descr = "";
            if (recipe.description.length > 100)
                descr = recipe.description.substring(0, 100) + "..."
            else
                descr = recipe.description + "..."

            let element = document.getElementsByClassName("card-wrapper")[0]
            element.innerHTML += `<a href="reteta.html?id=${recipe._id}">
        <div class="card">
            <img src='data:${recipe.picture_type};base64,${recipe.picture}' alt="poza cu reteta 1" class="card-img">
            <h2>${recipe.title}</h2>
            <p class="descriere">
                ${descr}
            </p>
            <button class="btn">
                <i class="fas fa-heart"></i>
            </button>
        </div>
        </a>`
            console.log("done")
        })
    }
}


xhttp.open("GET", "http://localhost:5000/favorites?user_id=" + id, true);
xhttp.send();