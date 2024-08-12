// Configuración de toastr
toastr.options = {
    closeButton: false,
    progressBar: false,
    positionClass: window.innerWidth <= 768 ? "toast-bottom-right" : "toast-top-right",
    timeOut: "2000",
    showMethod: "slideDown",
};

// Referencias a elementos del DOM
const header = document.getElementById("header");
const footer = document.getElementById("footer");
const inputTxt = document.getElementById("txtcontent");
const spanMessage = document.getElementById("spanMessage");
const bttnCypher = document.getElementById("bttnCypher");
const bttnDecypher = document.getElementById("bttnDecypher");
const defaultResult = document.getElementById("defaultResult");
const showResult = document.getElementById("showResult");
const bttnCopy = document.getElementById("bttncopy");
const bttnPaste = document.getElementById("bttnpaste");
const bttnResetPage = document.getElementById("bttnResetPage");
const gifContainer = document.getElementById("gif-container"); // Agregado para el GIF

// Mapa de vocales para cifrado
const vowels = {
    a: "ai",
    e: "enter",
    i: "imes",
    o: "ober",
    u: "ufat",
};


/* Inicializa el boton (deshabilitado) */
bttnResetPage.disabled = true;

// Asignar funciones a eventos
bttnCypher.addEventListener("click", cypherText);
bttnDecypher.addEventListener("click", decypherText);
bttnCopy.addEventListener('click', copyText);
bttnPaste.addEventListener("click", pasteText);
bttnResetPage.addEventListener("click", resetPage);

inputTxt.addEventListener("input", () => { // Toma lo que se digita para validar
    const text = inputTxt.value;
    const valid = /^[a-z \n]*$/.test(text);

    bttnCypher.disabled = !valid; /* Deshabilita el boton */
    bttnDecypher.disabled = !valid;
    spanMessage.classList.toggle("spanError", !valid);
});

// Función de cifrado
function cypherText() {
    const inputWord = inputTxt.value;
    if (!inputWord) {
        console.log("Digite una palabra");
        toastr.warning('¡La entrada no puede estar vacía!', 'Advertencia');
        return;
    }

    const cypherArray = Array.from(inputWord).map(letter =>
        vowels[letter] || letter
    );
    const cypherWord = cypherArray.join("");

    scrollToFooter(); /* Desplazamiento hacia el footer si la dimensión de pantalla es menor o igual a 768 */
    showCypherText(cypherWord);
    cleanFields();
}

// Función de descifrado
function decypherText() {
    let inputWord = inputTxt.value;

    if (!inputWord) {
        console.log("Digite una palabra");
        toastr.warning('¡La entrada no puede estar vacía!', 'Advertencia');
        return;
    }
    for (const [key, value] of Object.entries(vowels)) {
        inputWord = inputWord.replace(new RegExp(value, 'g'), key);
    }
    scrollToFooter(); /* Desplazamiento hacia el footer si la dimensión de pantalla es menor o igual a 768 */
    showCypherText(inputWord);
    cleanFields();
}

// Función para mostrar el texto cifrado
function showCypherText(word) {
    showResult.textContent = word;
    bttnResetPage.disabled = false;

    defaultResult.style.display = "none";
    showResult.style.display = "block";
    bttnCopy.style.display = "block";
    bttnPaste.style.display = "none";

    // Ocultar GIF después de un breve retraso
    setTimeout(() => {
        gifContainer.style.display = "none";
    }, 1000); // Ajusta el tiempo según sea necesario
}

// Función de limpiar campos
function cleanFields() {
    inputTxt.value = '';
}

// Función de copiar texto al portapapeles
function copyText() {
    if (showResult.textContent == "") {
        return;
    }

    const txtCopied = showResult.textContent;

    navigator.clipboard.writeText(txtCopied)
    .then(() => {
        toastr.success(`El Texto "${txtCopied}" ha sido copiado al portapapeles. ¡Copiado!`);
        showResult.textContent = "";
        bttnCopy.style.display = "none";
        bttnPaste.style.display = "block";
    })
    .catch(err => {
        toastr.error('¡Algo salió mal!', 'Error');
        console.error('Error al copiar el texto: ', err);
    });
}

// Función de pegar texto al textArea o input
function pasteText() {
    navigator.clipboard.readText()
        .then(text => {
            inputTxt.value = text;
        })
        .catch(err => {
            console.error('No se pudo leer el contenido del portapapeles: ', err);
        });

    scrollToHeader();
}

// Función para desplazar a un elemento
function scrollToElement(element) {
    if (window.innerWidth <= 768) { // Ajusta el valor según sea necesario
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// Desplazamiento hacia el footer si la dimensión de pantalla es menor o igual a 768
function scrollToFooter() {
    scrollToElement(footer);
}

// Desplazamiento hacia el header si la dimensión de pantalla es menor o igual a 768
function scrollToHeader() {
    scrollToElement(header);
}

// Restablecer la página al estado predeterminado
function resetPage() {
    scrollToHeader();
    // Esperar 3 milisegundos antes de recargar la página
    setTimeout(() => {
        location.reload();
    }, 500); 
}

const footerParagraph = document.getElementById('footer-copy')
const actualYear = new Date().getFullYear()

let footerText = `Luis Eduardo Arocha --  Copy \u00A9 ${actualYear}`
footerParagraph.innerHTML = footerText
