// manejo de la UI: teclado y botones
import { botones, fondoblur } from "./elementos";

// cerrar popovers con la tecla Escape
document.addEventListener("keydown", (e: KeyboardEvent) => {
  if (e.key === "Escape") {
    const popovers = document.querySelectorAll(":popover-open");
    popovers.forEach((popover: Element) => {
      (popover as HTMLElement).hidePopover();
    });
    fondoblur.classList.remove("activado");
    botones.forEach((b: HTMLButtonElement) => b.classList.remove("activo"));
  }
});

// manejo de botones para mostrar/ocultar formularios
botones.forEach((boton: HTMLButtonElement) => {
  boton.addEventListener("click", () => {
    const estaActivo = boton.classList.contains("activo");
    fondoblur.classList.add("activado");

    botones.forEach((b: HTMLButtonElement) => {
      b.classList.remove("activo");
    });

    if (!estaActivo) {
      boton.classList.add("activo");
    } else {
      fondoblur.classList.remove("activado");
    }
  });
});
