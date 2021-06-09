if (localStorage.getItem("AuthorizationToken") !== null) {
    let button = document.getElementById("logout")
        // console.log(button.childNodes)
    button.innerHTML += `<button class="logout">
                <a href="/index.html" class="ref">
                <i class="fa fa-sign-out" aria-hidden="true"></i>
                <span>Logout</span>
                </a>
            </button>`

    button.addEventListener('click', (event) => {
        localStorage.removeItem("AuthorizationToken")
    })


    if (document.getElementById("adauga_reteta")) {
        let button2 = document.getElementById("adauga_reteta")
        button2.innerHTML += `<button>
        <a href="/adauga_reteta.html">
            <i class="fas fa-plus"></i>
            <span>Adaugă o rețetă</span>
        </a>
    </button>`
    }
}