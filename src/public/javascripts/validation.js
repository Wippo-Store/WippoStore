const form = document.getElementsByTagName('form')[0];
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