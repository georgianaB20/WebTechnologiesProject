window.onload = function () {
    const xhttp = new XMLHttpRequest()

     xhttp.open('GET', 'http://localhost:5000/get_user');

     xhttp.setRequestHeader("Content-Type", "application/json");
     xhttp.setRequestHeader("Accept", "application/json");
     xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");

     xhttp.setRequestHeader("Authorization", localStorage.getItem('AuthorizationToken'))

     xhttp.onload = function () {

         if (xhttp.status !== 200) {
             let res = JSON.parse(xhttp.response)
             alert(res.message);
         }
         else {
             let res = JSON.parse(xhttp.response)
             console.log(xhttp)
         }
     }
     xhttp.send();
}
