let button = document.getElementById("my_recipes")
if (localStorage.getItem("AuthorizationToken") !== null)
    button.innerHTML += `<button>
    <a href="retetele_mele.html">
        <i class="fas fa-carrot"></i>
        Rețetele mele
    </a>
    </button>`