const form = document.getElementsByTagName('form');
const btn = document.getElementById('btnR');

var regexNoT = /^(?:\d{15,16}|\d{4}(?:(?:\s+\d{4}){3}|\s+\d{6}\s\d{5}))$/; // 16 digitos o de 4 en 4 separados por espacios.
var regexName = /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){},.\-\´|~<>;:[\]]{3,}$/;


//CARD NUMBER
const cn = document.getElementById('ID_Tarjeta');
const cnError = document.querySelector('#ID_Tarjeta + span.errorNoT');

cn.addEventListener('input', function(event) {
    var test = showErrorCN();

    if (test) {
        // If there is still an error, show the correct error
        cn.className = 'invalid  form-control';
        btn.disabled = true;
        showErrorCN();

    } else {
        cn.className = ' form-control';
        btn.disabled = false;
        cnError.innerHTML = ''; // Reset the content of the message
        cnError.className = 'error'; // Reset the visual state of the message
    }
});

function showErrorCN() {
    if (cn.value.length === 0) {
        cnError.textContent = 'Campo requerido';
        cnError.className = 'error active';
        return true;
    }
    if (!regexNoT.test(cn.value)) {
        cnError.textContent = 'Número de tarjeta incorrecto';
        cnError.className = 'error active';
        return true;
    }
    return false;
}

//CARD NAME
const cna = document.getElementById('Nom_Tarjeta');
const cnaError = document.querySelector('#Nom_Tarjeta + span.errorNomT');

cna.addEventListener('input', function(event) {
    var test = showErrorCNA();

    if (test) {
        // If there is still an error, show the correct error
        cna.className = 'invalid  form-control';
        btn.disabled = true;
        showErrorCNA();

    } else {
        cna.className = ' form-control';
        btn.disabled = false;
        cnaError.innerHTML = ''; // Reset the content of the message
        cnaError.className = 'error'; // Reset the visual state of the message
    }
});

function showErrorCNA() {
    if (cna.value.length === 0) {
        cnaError.textContent = 'Campo requerido';
        cnaError.className = 'error active';
        return true;
    }
    if (!regexName.test(cna.value)) {
        cnaError.textContent = 'Formato inválido';
        cnaError.className = 'error active';
        return true;
    }
    return false;
}

//CVV
const cvv = document.getElementById('cvv');
const cvvError = document.querySelector('#cvv + span.errorCVV');

var regexCVV = /^[0-9]{1,3}$/;

cvv.addEventListener('input', function(event) {
    var test = showErrorCVV();

    if (test) {
        // If there is still an error, show the correct error
        cvv.className = 'invalid  form-control';
        btn.disabled = true;
        showErrorCVV();

    } else {
        cvv.className = ' form-control';
        btn.disabled = false;
        cvvError.innerHTML = ''; // Reset the content of the message
        cvvError.className = 'error'; // Reset the visual state of the message
    }
});

function showErrorCVV() {
    if (cvv.value.length === 0) {
        cvvError.textContent = 'Campo requerido';
        cvvError.className = 'error active';
        return true;
    }
    if (!regexCVV.test(cvv.value)) {
        cvvError.textContent = 'Formato inválido';
        cvvError.className = 'error active';
        return true;
    }
    return false;
}