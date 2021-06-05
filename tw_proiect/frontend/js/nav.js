function searchFct(event) {
    const searchText = document.getElementsByClassName("search-txt")[0].value;
    if (searchText.length > 0) {
        console.log(searchText);
        const query = encodeURIComponent(searchText);
        document.getElementsByClassName("search-button")[0].setAttribute("href", "retete.html?search=" + query);
    } else {
        event.preventDefault();
    }
}

const search = document.getElementsByClassName("search-button")[0];
search.onclick = searchFct;
// let link = window.location.search.split("=")[1]; //luam cuvintele dupa care sa efectuam cautarea
// console.log(link)
// if (link !== undefined) {
//     console.log("apel la backend cu AJAX")
//     var xhttp = new XMLHttpRequest();
//     xhttp.onreadystatechange = function() {
//         //console.log(this.readyState);
//         if (this.status == 200 && this.readyState == 4) {
//             let recipes = JSON.parse(this.response)
//             console.log(recipes)
//         }
//     }

//     xhttp.open("GET", "http://localhost:5000/search?data=" + link, true);
//     xhttp.send();

// }