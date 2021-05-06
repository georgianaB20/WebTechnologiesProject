//adaugam eventListener pentru butoane
document.getElementById("adauga_ingredient").addEventListener("click", adauga_ingredient);
document.getElementById("sterge_ingredient").addEventListener("click", sterge_ingredient);


function adauga_ingredient() {
    //console.log("adauga ingredient");
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        //console.log(this.readyState);
        if (this.status == 200 && this.readyState == 4) {
            var ingrediente = document.getElementById('ingrediente');
            var label_nou = document.createElement('label');
            var number = ingrediente.getElementsByTagName('input').length + 1;
            var nume = 'ingredient'.concat(number.toString());
            label_nou.setAttribute('for', nume);

            var input_nou = document.createElement('input');
            input_nou.setAttribute('type', 'text');
            input_nou.setAttribute('id', nume);
            input_nou.setAttribute('name', nume);

            //var br=document.createElement('br');

            ingrediente.appendChild(label_nou);
            ingrediente.appendChild(input_nou);
            //console.log("all gut");

        }
    }
    xhttp.open("GET", "/adauga_reteta.html", true);
    xhttp.send();

}

function sterge_ingredient() {
    //console.log("sterge ingredient");

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        //console.log(this.readyState);
        if (this.status == 200 && this.readyState == 4) {
            var ingrediente = document.getElementById('ingrediente');
            var inputs = ingrediente.getElementsByTagName('input');
            var labels = ingrediente.getElementsByTagName('label');
            //var breaks=ingrediente.getElementsByTagName('br');
            if (inputs.length > 1) {
                var index = (inputs.length) - 1;
                ingrediente.removeChild(inputs[index]);
                ingrediente.removeChild(labels[index]);
                //ingrediente.removeChild(breaks[index]);
            }
        }
    }
    xhttp.open("GET", "/adauga_reteta.html", true);
    xhttp.send();
}
