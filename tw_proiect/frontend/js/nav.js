var search = document.getElementsByClassName("search-button")[0];
search.addEventListener("click", searchFct);

function searchFct(event) {
    if (document.getElementsByClassName("search-txt")[0].value.length > 0) {
        console.log(document.getElementsByClassName("search-txt")[0].value)



    }
}