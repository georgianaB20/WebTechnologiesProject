var ingrediente=document.getElementById('ingrediente');
var adauga=document.getElementById('adauga_ingredient');
var sterge=document.getElementById('sterge_ingredient');

adauga.onclick = function(){
    var label_nou=document.createElement('label');
    var number=ingrediente.getElementsByTagName('input').length+1;
    var nume='ingredient'.concat(number.toString());
    label_nou.setAttribute('for',nume);

    var input_nou=document.createElement('input');
    input_nou.setAttribute('type','text');
    input_nou.setAttribute('id',nume);

    //var br=document.createElement('br');

    ingrediente.appendChild(label_nou);
    ingrediente.appendChild(input_nou);
    //ingrediente.appendChild(br);
}

sterge.onclick=function(){
    var inputs=ingrediente.getElementsByTagName('input');
    var labels=ingrediente.getElementsByTagName('label');
    //var breaks=ingrediente.getElementsByTagName('br');
    if(inputs.length>1){
        var index=(inputs.length)-1;
        ingrediente.removeChild(inputs[index]);
        ingrediente.removeChild(labels[index]);
        //ingrediente.removeChild(breaks[index]);
    }
}