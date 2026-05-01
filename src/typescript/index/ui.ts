// Importamos botones y el fondo blur
import { botones, fondoblur } from "./elementos";

// Escuchar cuando se presiona una tecla
document.addEventListener("keydown", (e: KeyboardEvent) => {
  // Si la tecla es Escape, cerramos todo
  if (e.key === "Escape") {
    // Cerramos cualquier popover que esté abierto
    const popovers = document.querySelectorAll(":popover-open");
    popovers.forEach((popover: Element) => {
      (popover as HTMLElement).hidePopover();
    });
    // Quitamos el fondo blur y desactivamos los botones
    fondoblur.classList.remove("activado");
    botones.forEach((b: HTMLButtonElement) => b.classList.remove("activo"));
  }
});

// A cada boton de login/registro le agregamos un click
botones.forEach((boton: HTMLButtonElement) => {
  boton.addEventListener("click", () => {
    // Revisamos si el boton ya está activo
    const estaActivo = boton.classList.contains("activo");

    // Activamos el fondo blur
    fondoblur.classList.add("activado");

    // Quitamos la clase activo a todos los botones
    botones.forEach((b: HTMLButtonElement) => b.classList.remove("activo"));

    // Si no estaba activo, lo activamos; si ya lo estaba, quitamos el blur
    if (!estaActivo) {
      boton.classList.add("activo");
    } else {
      fondoblur.classList.remove("activado");
    }
  });
});
