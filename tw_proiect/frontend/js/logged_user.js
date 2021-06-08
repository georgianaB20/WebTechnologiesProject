const user_page = document.getElementsByClassName('user')[0];
user_page.addEventListener("click", check_if_logged);

const req = new XMLHttpRequest()


function check_if_logged(event) {
    console.log('hello there')

    event.preventDefault()
    const logg = localStorage.getItem('AuthorizationToken')
    if (logg) {
        window.location.href = './contul_meu.html'
    }  else  {
        window.location.href='./login.html'
    }
}



