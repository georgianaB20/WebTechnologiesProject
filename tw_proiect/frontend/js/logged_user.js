const logged = document.getElementsByClassName('user')[0];
logged.addEventListener("click", check_if_logged);

const req = new XMLHttpRequest()


function check_if_logged(event) {
    console.log('hello there')

    event.preventDefault()
    // let res;
    const logg = localStorage.getItem('AuthorizationToken')
    if (logg) {
        window.location.href = './contul_meu.html'
        // const req = new XMLHttpRequest()
        // const queryString = window.location.search;
        const xhttp = new XMLHttpRequest()

    }  else  {
        window.location.href='/login.html'
    }
}

