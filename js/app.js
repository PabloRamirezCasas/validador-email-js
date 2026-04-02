document.addEventListener("DOMContentLoaded", () => {
  //El objeto email será el que almacene los valores que se introduzcan en el formulario
  const email = {
    email: "",
    asunto: "",
    mensaje: "",
    cc: "",
  };

  const inputEmail = document.querySelector("#email");
  const inputAsunto = document.querySelector("#asunto");
  const inputMensaje = document.querySelector("#mensaje");
  const inputCC = document.querySelector("#cc");
  const formulario = document.querySelector("#formulario");
  const btnEnviar = document.querySelector('#formulario button[type = "submit"]');
  const btnReset = document.querySelector('#formulario button[type = "reset"]');
  const spinner = document.querySelector('#spinner');

  inputEmail.addEventListener("input", validar);
  inputAsunto.addEventListener("input", validar);
  inputMensaje.addEventListener("input", validar);
  inputCC.addEventListener('input', validar);
  formulario.addEventListener('submit', enviarEmail);

  //Reseteamos el formulario a traves del botón 'Reset'
  btnReset.addEventListener("click", (e) => {
    e.preventDefault();

    resetFormulario();
  });

  function validar(e) {
    const esOpcional = e.target.id === "cc";
    const estaVacio = e.target.value.trim() === "";
    
    //Comprueba que los campos obligatorio no estén vacíos
    if (!esOpcional && estaVacio) {
      mostrarAlerta(`El campo ${e.target.id} es obligatorio`, e.target.parentElement,);
      email[e.target.id] = "";
      comprobarEmail();
      return;
    }

    if(esOpcional && estaVacio) {
        email[e.target.id] = "";
        limpiarAlerta(e.target.parentElement);
        comprobarEmail();
        return;
    }
   

    if ((e.target.id === "cc" || e.target.id === "email") && !validarEmail(e.target.value)) {
      mostrarAlerta("El email no es valido", e.target.parentElement);
      email[e.target.id] = "";
      comprobarEmail();
      return;
    }

    email[e.target.id] = e.target.value.trim().toLowerCase();
     //La función limpiarAlerta lo que hace aquí es una vez que el input esta lleno se borre el msj de error
    limpiarAlerta(e.target.parentElement);
    comprobarEmail();
  }


  function mostrarAlerta(mensaje, refencia) {
    //La función limpiarAlerta lo que hace es que no aparezcan multiples mensajes de error
    limpiarAlerta(refencia);

    //Creamos un elemento P mediante Scripting
    const mensajeError = document.createElement("P");
    mensajeError.classList.add(
      "bg-red-600",
      "text-white",
      "p-2",
      "text-center",
    );
    mensajeError.textContent = mensaje;
    refencia.appendChild(mensajeError);
  }

  function limpiarAlerta(refencia) {
    const existe = refencia.querySelector(".bg-red-600");
    if (existe) {
      existe.remove();
    }
  }

  //Validamos que el email introducido sea uno correcto mediante una expresión regular
  function validarEmail(texto) {
    const regex = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
    const resultado = regex.test(texto);
    return resultado;
  }

  //Validamos que el objeto email tenga todos sus valores llenos
  function comprobarEmail(e) {
    const {email: correo, asunto, mensaje} = email;

    const hayErrores = document.querySelectorAll('.bg-red-600').length > 0;
    if ([correo, asunto, mensaje].includes("") || hayErrores) {
      btnEnviar.classList.add("opacity-50");
      btnEnviar.disabled = true;
      return;
    }

    btnEnviar.classList.remove("opacity-50");
    btnEnviar.disabled = false;
  }

  function enviarEmail(e) {
    e.preventDefault();

    const elementos = document.querySelectorAll('input, textarea,button');

    elementos.forEach( el => el.disabled = true);
    
    spinner.classList.add('flex');
    spinner.classList.remove('hidden');
    btnReset.classList.add('opacity-50');


    setTimeout( () => {

        spinner.classList.remove('flex');
        spinner.classList.add('hidden');
        resetFormulario();

        btnReset.classList.remove('opacity-50');
        elementos.forEach( el => el.disabled = false);

        comprobarEmail();

        const parrafo = document.createElement('P');
        parrafo.classList.add('bg-green-500','text-white', 'p-2', 'text-center', 'rounded-lg', 'mt-10','font-bold', 'text-sm','uppercase');
        parrafo.textContent ='El formulario se ha enviado correctamente';
        formulario.appendChild(parrafo);
        limpiarAlerta(formulario);
        
        setTimeout(() => {
            //Se puede eliminar tambien desde el elemento Padre
            //formulario.removeChild(parrafo);
            parrafo.remove();
           
        }, 2000);
    },3000)

    
  }

  function resetFormulario () {
    
    email.email = "";
    email.asunto = "";
    email.mensaje = "";
    email.cc = "";

    comprobarEmail();
    formulario.reset();
  }
});
