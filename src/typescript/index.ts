// para poder usarlos en formularios.ts funcion formularios
export const formLogin = document.getElementById(
  "formLogin",
) as HTMLFormElement;

export const formRegistro = document.getElementById(
  "formRegistro",
) as HTMLFormElement;

// form de login
formLogin.addEventListener("submit", () => {});

// form de registro
formRegistro.addEventListener("submit", () => {});

const lightbox = document.getElementById("lightbox") as HTMLElement;
const articuloImagen = document.querySelector(
  ".articulo img",
) as HTMLImageElement;

const botones = document.querySelectorAll(
  ".login-registro button",
) as NodeListOf<HTMLButtonElement>;
const fondoblur = document.querySelector(".fondoblur") as HTMLElement;

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

articuloImagen.addEventListener("click", () => {
  lightbox.classList.add("active");
});

lightbox.addEventListener("click", () => {
  lightbox.classList.remove("active");
});
