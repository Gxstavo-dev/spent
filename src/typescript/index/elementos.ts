// elementos del DOM para los formularios
export const formLogin = document.getElementById(
  "formLogin",
) as HTMLFormElement;

export const formRegistro = document.getElementById(
  "formRegistro",
) as HTMLFormElement;

// elementos para la UI y lightbox
export const lightbox = document.getElementById("lightbox") as HTMLElement;
export const articuloImagen = document.querySelector(
  ".articulo img",
) as HTMLImageElement;

export const botones = document.querySelectorAll(
  ".login-registro button",
) as NodeListOf<HTMLButtonElement>;
export const fondoblur = document.querySelector(".fondoblur") as HTMLElement;
