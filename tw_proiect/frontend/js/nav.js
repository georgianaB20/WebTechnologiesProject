var search = document.getElementsByClassName("search-button")[0];
search.addEventListener("click", searchFct);

function searchFct(event) {
    // var xhttp = new XMLHttpRequest();
    // xhttp.onreadystatechange = function() {
    //     //console.log(this.readyState);
    //     if (this.status == 200 && this.readyState == 4) {
    //         let recipe = JSON.parse(this.response)
    //             //element = document.getElementsByTagName("title")[0]
    //             // console.log(element)
    //             // element.innerHTML = `${recipe.title}`
    //             // element = document.getElementById("recipe-info")
    //             // element.innerHTML = `<h1>${recipe.title}</h1>` + element.innerHTML
    //             // element = document.getElementById("time")
    //             // element.innerHTML += `<span class="txt">${recipe.time_value} ${recipe.time_unit}</span>`
    //             // element = document.getElementById("dificultate")
    //             // element.innerHTML += `<span class="txt">${recipe.difficulty}</span>`
    //             // element = document.getElementById("popularitate")
    //             // element.innerHTML += `<span class="txt">${recipe.comments.length}</span>`
    //             // element = document.getElementById("ingrediente")
    //             // console.log(recipe.ingredients)
    //             // recipe.ingredients.forEach(ingredient => {
    //             //     element.innerHTML +=
    //             //         `<li>
    //             //     <div class="container-ingredient">
    //             //         <div class="ingredient">
    //             //             <span class="numele-ingheientului">${ingredient}</span>
    //             //         </div>
    //             //     </div>
    //             // </li>`
    //             // });
    //             // element = document.getElementById("instructiuni")
    //             // element.innerHTML += `<p class="pasi">${recipe.description}</p>`
    //         console.log(recipe)

    //         element = document.getElementById("imagine-reteta")
    //             // console.log(recipe.picture.ContentType)
    //         element.innerHTML = `<img class="img" src='data:${recipe.picture_type};base64,${recipe.picture}' alt="Poza a retetei 1">`
    //     }
    // }
    // xhttp.open("GET", "http://localhost:5000/recipe?id=" + id, true);
    // xhttp.send();

    if (document.getElementsByClassName("search-txt")[0].value.length > 0) {
        console.log(document.getElementsByClassName("search-txt")[0].value)

        let query = document.getElementsByClassName("search-txt")[0].value
        let search_btn = document.getElementsByClassName("search-button")[0].setAttribute("href", "retete.html?search=" + query)
    } else {
        event.preventDefault();
    }
}

let link = window.location.search.split("=")[1]; //luam cuvintele dupa care sa efectuam cautarea
console.log(link)
if (link !== undefined) {
    console.log("apel la backend cu AJAX")
}