// manejo de la UI: teclado y botones
import { botones, fondoblur } from "./elementos";

const dialogLogin = document.getElementById("dialogLogin") as HTMLElement;
const dialogRegistro = document.getElementById("dialogRegistro") as HTMLElement;
const btnLogin = document.getElementById("btnLogin") as HTMLButtonElement;
const btnRegistro = document.getElementById("btnRegistro") as HTMLButtonElement;

// cerrar popovers con la tecla Escape
document.addEventListener("keydown", (e: KeyboardEvent) => {
  if (e.key === "Escape") {
    dialogLogin.hidePopover();
    dialogRegistro.hidePopover();
    fondoblur.classList.remove("activado");
    botones.forEach((b: HTMLButtonElement) => b.classList.remove("activo"));
  }
});

// manejo de botones para mostrar/ocultar formularios
btnLogin.addEventListener("click", () => {
  const estaAbierto = dialogLogin.matches(":popover-open");

  if (estaAbierto) {
    dialogLogin.hidePopover();
    fondoblur.classList.remove("activado");
    btnLogin.classList.remove("activo");
  } else {
    dialogRegistro.hidePopover();
    btnRegistro.classList.remove("activo");
    dialogLogin.showPopover();
    fondoblur.classList.add("activado");
    btnLogin.classList.add("activo");
  }
});

btnRegistro.addEventListener("click", () => {
  const estaAbierto = dialogRegistro.matches(":popover-open");

  if (estaAbierto) {
    dialogRegistro.hidePopover();
    fondoblur.classList.remove("activado");
    btnRegistro.classList.remove("activo");
  } else {
    dialogLogin.hidePopover();
    btnLogin.classList.remove("activo");
    dialogRegistro.showPopover();
    fondoblur.classList.add("activado");
    btnRegistro.classList.add("activo");
  }
});
