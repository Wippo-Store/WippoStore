const form = document.getElementsByTagName('form');
const btn = document.getElementById('btn');
var regexN = /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){},.\-\´|~<>;:[\]]{2,}$/;

//CP VALIDATION
const cp = document.getElementById('CP');
const cpError = document.querySelector('#CP + span.errorCP');

var regexCP = /^([0-9])*$/;

cp.addEventListener('input', function(event) {
    var test = showErrorCP();

    if (test) {
        // If there is still an error, show the correct error
        cp.className = 'invalid  form-control';
        btn.disabled = true;
        showErrorCP();

    } else {
        cp.className = ' form-control';
        btn.disabled = false;
        cpError.innerHTML = ''; // Reset the content of the message
        cpError.className = 'error'; // Reset the visual state of the message
    }
});

function showErrorCP() {
    if (!regexCP.test(cp.value)) {
        cpError.textContent = 'Inválido';
        cpError.className = 'error active';
        return true;
    }
    return false;

}

//STATE VALIDATION
const est = document.getElementById('Estado');
const estError = document.querySelector('#Estado + span.errorS');

est.addEventListener('input', function(event) {
    var test = showErrorS();

    if (test) {
        // If there is still an error, show the correct error
        est.className = 'invalid  form-control';
        btn.disabled = true;
        showErrorS();

    } else {
        est.className = ' form-control';
        btn.disabled = false;
        estError.innerHTML = ''; // Reset the content of the message
        estError.className = 'error'; // Reset the visual state of the message
    }
});

function showErrorS() {
    if (!regexN.test(est.value)) {
        estError.textContent = 'Inválido';
        estError.className = 'error active';
        return true;
    }
    return false;
}

const m = document.getElementById('MA');
const mError = document.querySelector('#MA + span.errorM');

m.addEventListener('input', function(event) {
    var test = showErrorM();

    if (test) {
        // If there is still an error, show the correct error
        m.className = 'invalid  form-control';
        btn.disabled = true;
        showErrorM();

    } else {
        m.className = ' form-control';
        btn.disabled = false;
        mError.innerHTML = ''; // Reset the content of the message
        mError.className = 'error'; // Reset the visual state of the message
    }
});

function showErrorM() {
    if (!regexN.test(m.value)) {
        mError.textContent = 'Inválido';
        mError.className = 'error active';
        return true;
    }
    return false;

}