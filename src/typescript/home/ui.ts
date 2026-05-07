import {
  sidebar,
  subBarralateral,
  btnAjustes,
  btnCuenta,
  btnNube,
  Feedback,
  ventanaAjustes,
  ventanaCuenta,
  ventanaNube,
  ventanaFeedback,
} from "./elementos";

// nos servira para guardar el boton que esta activo en ese momento,
// primero estara en null para que no tenga ningun boton
let botonActivo: HTMLButtonElement | null = null;

// obtenemos todos los botones dentro del sidebar
const botones = sidebar.querySelectorAll(
  "button",
) as NodeListOf<HTMLButtonElement>;
botones.forEach((boton) => {
  // cada boton tiene su evento
  boton.addEventListener("click", () => {
    // como estamos recorriendo todos los botones que estan en el sidebar tambien se contaran los que no aplicara para abrir la subBarralateral
    // entcs el switch nos ayudara comparando cada id de ese boton y si tiene Ajustes,Cuenta,Nube,Guia,Feedback,logout,SobreSpent haremos que no los almacene y que se detenga la ejeccion del
    // evento para que no abra la subBarralateral
    switch (boton.id) {
      case "Ajustes":
      case "Cuenta":
      case "Nube":
      case "Guia":
      case "Feedback":
      case "logout":
      case "SobreSpent":
        botonActivo = null;
        return;

      // el valor por defecto tendra la logica de abrir o cerrar la barra
      default:
        // si el boton es clickeado es el mismo que esta en botonActivo --> cerramos la barraLateral
        if (botonActivo === boton) {
          subBarralateral.classList.remove("mostrarBarra");
          botonActivo = null; // quitamos el boton que se guardo en botonActivo
        } else {
          // si no es el mismo se agregara la clase
          subBarralateral.classList.add("mostrarBarra");
          botonActivo = boton; // ahora guardamos el otro boton que se clickeo
        }
    }
  });
});

/* logica para abrir las ventanas */

btnAjustes.addEventListener("click", () => {
  ventanaAjustes.classList.toggle("mostrarVentana");
});
btnCuenta.addEventListener("click", () => {
  ventanaCuenta.classList.toggle("mostrarVentana");
});
btnNube.addEventListener("click", () => {
  ventanaNube.classList.toggle("mostrarVentana");
});
Feedback.addEventListener("click", () => {
  ventanaFeedback.classList.toggle("mostrarVentana");
});

/*  eventos del DOM  */

document.addEventListener("keypress", (e) => {
  if (e.key == "Escape") {
    ventanaAjustes.classList.remove("mostrarVentana");
    ventanaCuenta.classList.remove("mostrarVentana");
    ventanaNube.classList.remove("mostrarVentana");
    ventanaFeedback.classList.remove("mostrarVentana");
  }
});
