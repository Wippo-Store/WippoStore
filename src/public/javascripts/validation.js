const form = document.getElementsByTagName('form');
const btn = document.getElementById('btn');

// EMAIL VALIDATION

const email = document.getElementById('Correo_Electronico');
const emailError = document.querySelector('#Correo_Electronico + span.errorE');

var regexE = /(?:[a-z0-9!#$%&'+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

email.addEventListener('input', function(event) {
    var test = showErrorE();

    if (test) {
        // If there is still an error, show the correct error
        email.className = 'invalid  form-control';
        btn.disabled = true;
        showErrorE();

    } else {
        email.className = ' form-control';
        btn.disabled = false;
        emailError.innerHTML = ''; // Reset the content of the message
        emailError.className = 'error'; // Reset the visual state of the message
    }
});

function showErrorE() {
    if (email.value.length === 0) {
        emailError.textContent = 'Ingresa tu correo electronico.';
        emailError.className = 'error active';
        return true;
    }

    if (!regexE.test(email.value)) {
        emailError.textContent = 'Correo electrónico no válido.';
        emailError.className = 'error active';
        return true;
    }
    return false;
}

// PASSWORD VALIDATION
const password = document.getElementById('pass');
const passwordError = document.querySelector('#pass + span.errorP');

var regexP = /^(?=.*\d)(?=.*[\u0021-\u002b\u003c-\u0040])(?=.*[A-Z])(?=.*[a-z])\S{8,16}/;

password.addEventListener('input', function(event) {
    var test = showErrorP();

    if (test) {
        // If there is still an error, show the correct error
        password.className = 'invalid  form-control';
        btn.disabled = true;
        showErrorP();

    } else {
        password.className = ' form-control';
        btn.disabled = false;
        passwordError.innerHTML = ''; // Reset the content of the message
        passwordError.className = 'error'; // Reset the visual state of the message
    }
});

function showErrorP() {
    if (pass.value.length === 0) {
        passwordError.textContent = 'Ingresa una contraseña';
        passwordError.className = 'error active';
        return true;
    }

    if (!regexP.test(password.value)) {
        passwordError.textContent = 'La contraseña debe tener al entre 8 y 16 caracteres, al menos un dígito, al menos una minúscula, al menos una mayúscula y al menos un caracter no alfanumérico';
        passwordError.className = 'error active';
        return true;
    }
    return false;
}

// PASSWORD REPEAT VALIDATION
const passwordR = document.getElementById('passr');
const passwordRError = document.querySelector('#passr + span.errorPr');

passwordR.addEventListener('input', function(event) {
    var test = showErrorPr();

    if (test) {
        // If there is still an error, show the correct error
        passwordR.className = 'invalid  form-control';
        btn.disabled = true;
        showErrorPr();

    } else {
        passwordR.className = ' form-control';
        btn.disabled = false;
        passwordRError.innerHTML = ''; // Reset the content of the message
        passwordRError.className = 'error'; // Reset the visual state of the message
    }
});

function showErrorPr() {
    if (passr.value != pass.value) {
        passwordRError.textContent = 'La contraseña no coincide';
        passwordRError.className = 'error active';
        return true;
    }
    return false;
}


//NAME VALIDATION
var regexN = /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){},.\-\´|~<>;:[\]]{2,}$/;

const nameU = document.getElementById('Nombre');
const nameError = document.querySelector('#Nombre + span.errorN');

nameU.addEventListener('input', function(event) {
    var test = showErrorN(nameU, nameError);

    if (test) {
        // If there is still an error, show the correct error
        nameU.className = 'invalid  form-control';
        btn.disabled = true;
        showErrorN(nameU, nameError);

    } else {
        nameU.className = ' form-control';
        btn.disabled = false;
        nameError.innerHTML = ''; // Reset the content of the message
        nameError.className = 'error'; // Reset the visual state of the message
    }
});

// LAST NAME
const nameL = document.getElementById('AP');
const nameLError = document.querySelector('#AP + span.errorAP');

nameL.addEventListener('input', function(event) {
    var test = showErrorN(nameL, nameLError);

    if (test) {
        // If there is still an error, show the correct error
        nameL.className = 'invalid  form-control';
        btn.disabled = true;
        showErrorN(nameL, nameLError);

    } else {
        nameL.className = ' form-control';
        btn.disabled = false;
        nameLError.innerHTML = ''; // Reset the content of the message
        nameLError.className = 'error'; // Reset the visual state of the message
    }
});

// LAST NAME 2
const nameLL = document.getElementById('AM');
const nameLLError = document.querySelector('#AM + span.errorAM');

nameLL.addEventListener('input', function(event) {
    var test = showErrorN(nameLL, nameLLError);

    if (test) {
        // If there is still an error, show the correct error
        nameLL.className = 'invalid  form-control';
        btn.disabled = true;
        showErrorN(nameLL, nameLLError);

    } else {
        nameLL.className = ' form-control';
        btn.disabled = false;
        nameLLError.innerHTML = ''; // Reset the content of the message
        nameLLError.className = 'error'; // Reset the visual state of the message
    }
});

function showErrorN(campo, errorC) {
    if (campo.value.length === 0) {
        errorC.textContent = 'Campo requerido.';
        errorC.className = 'error active';
        return true;
    }

    if (!regexN.test(campo.value)) {
        errorC.textContent = 'Formato inválido';
        errorC.className = 'error active';
        return true;
    }
    return false;
}

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