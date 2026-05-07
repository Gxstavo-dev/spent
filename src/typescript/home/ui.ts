import {
  sidebar,
  subBarralateral,
  btnAjustes,
  btnCuenta,
} from "./elementos";
import { iniciarCategorias, cargarGastos } from "./categorias";
import { cargarIngresos } from "./ingresosList";

// lista de categorias disponibles para clasificar los gastos
const categorias = [
  "Personal", "Comida", "Transporte", "Trabajo", "Salud",
  "Entretenimiento", "Hogar", "Ropa", "Educacion", "Otros",
];

// almacena el boton del sidebar que esta actualmente seleccionado, null si ninguno
let botonActivo: HTMLButtonElement | null = null;

// controla la visibilidad de la subbarra lateral segun el tipo (categorias/ingresos) y opcionalmente una categoria especifica
function mostrarSubbarra(tipo: string, categoria?: string) {
  // ocultamos todos los contenidos de subbarra que esten visibles
  document.querySelectorAll(".contenido-subbarra").forEach((el) => {
    (el as HTMLElement).style.display = "none";
  });

  if (tipo === "categorias") {
    const c = document.getElementById("subbarra-categorias");
    if (c) c.style.display = "flex";
    if (categoria) {
      cargarGastos(categoria);
    } else {
      iniciarCategorias();
    }
  } else if (tipo === "ingresos") {
    const c = document.getElementById("subbarra-ingresos");
    if (c) c.style.display = "flex";
    cargarIngresos();
  }
}

// obtenemos todos los botones dentro del sidebar y les asignamos el evento de clic
const botones = sidebar.querySelectorAll(
  "button",
) as NodeListOf<HTMLButtonElement>;
botones.forEach((boton) => {
  boton.addEventListener("click", () => {
    switch (boton.id) {
      // estos botones abren modales o ejecutan acciones, no muestran la subbarra lateral
      case "btnIngreso":
      case "btnGasto":
      case "btnPresupuesto":
      case "Ajustes":
      case "Cuenta":
      case "logout":
        botonActivo = null;
        return;

      default:
        // si el boton clickeado es el mismo que estaba activo, cerramos la subbarra
        if (botonActivo === boton) {
          subBarralateral.classList.remove("mostrarBarra");
          botonActivo = null;
        } else {
          // si es un boton diferente, abrimos la subbarra con el contenido correspondiente
          subBarralateral.classList.add("mostrarBarra");
          botonActivo = boton;

          if (boton.id === "Categorias") {
            mostrarSubbarra("categorias");
          } else if (boton.id === "Ingresos") {
            mostrarSubbarra("ingresos");
          } else if (categorias.includes(boton.id)) {
            mostrarSubbarra("categorias", boton.id);
          }
        }
    }
  });
});

// referencias a los botones que abren los formularios modales
const btnIngreso = document.getElementById("btnIngreso") as HTMLElement;
const btnGasto = document.getElementById("btnGasto") as HTMLElement;
const btnPresupuesto = document.getElementById("btnPresupuesto") as HTMLElement;

// asignamos eventos para abrir cada modal al hacer clic en su boton correspondiente
btnAjustes.addEventListener("click", () => abrirModal("ventana_Ajustes"));
btnCuenta.addEventListener("click", () => abrirModal("ventana_Cuenta"));
btnIngreso.addEventListener("click", () => abrirModal("ventana_Ingreso"));
btnGasto.addEventListener("click", () => abrirModal("ventana_Gasto"));
btnPresupuesto.addEventListener("click", () => abrirModal("ventana_Presupuesto"));

// abre un modal de tipo dialog, pero solo si no hay otro modal abierto actualmente
function abrirModal(modal: string) {
  const dialog = document.getElementById(modal) as HTMLDialogElement;
  if (!dialog) return;

  // prevenimos abrir multiples modales al mismo tiempo
  const dialogActivo = document.querySelector(
    "dialog[open]",
  ) as HTMLDialogElement;
  if (dialogActivo) return;

  dialog.showModal();
}
