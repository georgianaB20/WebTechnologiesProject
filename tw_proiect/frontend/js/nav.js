function searchFct(event) {
    const searchText = document.getElementsByClassName("search-txt")[0].value;
    if (searchText.length > 0) {
        const query = encodeURIComponent(searchText);
        document.getElementsByClassName("search-button")[0].setAttribute("href", "retete.html?search=" + query);
    } else {
        event.preventDefault();
    }
}

const search = document.getElementsByClassName("search-button")[0];
search.onclick = searchFct;

if (localStorage.getItem("AuthorizationToken") !== null) {
    let contul_meu_button = document.getElementById("switcher")
    contul_meu_button.innerHTML = `<a href="contul_meu.html"><i class="far fa-user"></i></a>`
}