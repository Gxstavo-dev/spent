import {
  sidebar,
  subBarralateral,
  btnAjustes,
  btnCuenta,
  btnNube,
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
    // entcs el switch nos ayudara comparando cada id de ese boton y si tiene Ajustes,Cuenta,Nube,logout haremos que no los almacene y que se detenga la ejeccion del
    // evento para que no abra la subBarralateral
    switch (boton.id) {
      case "btnIngreso":
      case "btnGasto":
      case "btnPresupuesto":
      case "Ajustes":
      case "Cuenta":
      case "Nube":
      case "logout":
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

const btnIngreso = document.getElementById("btnIngreso") as HTMLElement;
const btnGasto = document.getElementById("btnGasto") as HTMLElement;
const btnPresupuesto = document.getElementById("btnPresupuesto") as HTMLElement;

btnAjustes.addEventListener("click", () => abrirModal("ventana_Ajustes"));
btnCuenta.addEventListener("click", () => abrirModal("ventana_Cuenta"));
btnNube.addEventListener("click", () => abrirModal("ventana_MigrarDatabase"));
btnIngreso.addEventListener("click", () => abrirModal("ventana_Ingreso"));
btnGasto.addEventListener("click", () => abrirModal("ventana_Gasto"));
btnPresupuesto.addEventListener("click", () => abrirModal("ventana_Presupuesto"));

function abrirModal(modal: string) {
  // verificamos si existe
  const dialog = document.getElementById(modal) as HTMLDialogElement;
  if (!dialog) return;

  // verificamos si existe
  const dialogActivo = document.querySelector(
    "dialog[open]",
  ) as HTMLDialogElement;
  if (dialogActivo) return;

  dialog.showModal();
}
