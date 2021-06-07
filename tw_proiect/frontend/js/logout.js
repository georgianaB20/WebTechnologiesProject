if (localStorage.getItem("AuthorizationToken") !== null) {
    let button = document.getElementById("logout")
        // console.log(button.childNodes)
    button.innerHTML += `<button>
                <a href="/index.html" class="ref">
                <i class="fa fa-sign-out" aria-hidden="true"></i>
                <span>Logout</span>
                </a>
            </button>`

    button.addEventListener('click', (event) => {
        localStorage.removeItem("AuthorizationToken")
    })
}