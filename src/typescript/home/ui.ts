import {
  sidebar,
  subBarralateral,
  btnAjustes,
  btnCuenta,
} from "./elementos";
import { iniciarCategorias, cargarGastos } from "./categorias";

const categorias = [
  "Personal", "Comida", "Transporte", "Trabajo", "Salud",
  "Entretenimiento", "Hogar", "Ropa", "Educacion", "Otros",
];

// nos servira para guardar el boton que esta activo en ese momento,
// primero estara en null para que no tenga ningun boton
let botonActivo: HTMLButtonElement | null = null;

function mostrarSubbarraCategorias(categoria?: string) {
  document.querySelectorAll(".contenido-subbarra").forEach((el) => {
    (el as HTMLElement).style.display = "none";
  });
  const c = document.getElementById("subbarra-categorias");
  if (c) c.style.display = "flex";

  if (categoria) {
    cargarGastos(categoria);
  } else {
    iniciarCategorias();
  }
}

// obtenemos todos los botones dentro del sidebar
const botones = sidebar.querySelectorAll(
  "button",
) as NodeListOf<HTMLButtonElement>;
botones.forEach((boton) => {
  // cada boton tiene su evento
  boton.addEventListener("click", () => {
    // entcs el switch nos ayudara comparando cada id de ese boton y si tiene Ajustes,Cuenta,logout haremos que no los almacene y que se detenga la ejeccion del
    // evento para que no abra la subBarralateral
    switch (boton.id) {
      case "btnIngreso":
      case "btnGasto":
      case "btnPresupuesto":
      case "Ajustes":
      case "Cuenta":
      case "logout":
        botonActivo = null;
        return;

      // el valor por defecto tendra la logica de abrir o cerrar la barra
      default:
        // si el boton es clickeado es el mismo que esta en botonActivo --> cerramos la barraLateral
        if (botonActivo === boton) {
          subBarralateral.classList.remove("mostrarBarra");
          botonActivo = null;
        } else {
          subBarralateral.classList.add("mostrarBarra");
          botonActivo = boton;

          if (boton.id === "Categorias") {
            mostrarSubbarraCategorias();
          } else if (categorias.includes(boton.id)) {
            mostrarSubbarraCategorias(boton.id);
          }
        }
    }
  });
});

const btnIngreso = document.getElementById("btnIngreso") as HTMLElement;
const btnGasto = document.getElementById("btnGasto") as HTMLElement;
const btnPresupuesto = document.getElementById("btnPresupuesto") as HTMLElement;

btnAjustes.addEventListener("click", () => abrirModal("ventana_Ajustes"));
btnCuenta.addEventListener("click", () => abrirModal("ventana_Cuenta"));
btnIngreso.addEventListener("click", () => abrirModal("ventana_Ingreso"));
btnGasto.addEventListener("click", () => abrirModal("ventana_Gasto"));
btnPresupuesto.addEventListener("click", () => abrirModal("ventana_Presupuesto"));

function abrirModal(modal: string) {
  const dialog = document.getElementById(modal) as HTMLDialogElement;
  if (!dialog) return;

  const dialogActivo = document.querySelector(
    "dialog[open]",
  ) as HTMLDialogElement;
  if (dialogActivo) return;

  dialog.showModal();
}
