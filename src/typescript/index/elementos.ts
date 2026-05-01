//  elementos del dom
// Traemos los elementos HTML para usarlos en otros archivos

// Formulario de inicio de sesion
export const formLogin = document.getElementById(
  "formLogin",
) as HTMLFormElement;

// Formulario de registro de usuario
export const formRegistro = document.getElementById(
  "formRegistro",
) as HTMLFormElement;

// Contenedor del lightbox (imagen ampliada)
export const lightbox = document.getElementById("lightbox") as HTMLElement;

// Imagen dentro del artículo, al hacer click se abre el lightbox
export const articuloImagen = document.querySelector(
  ".articulo img",
) as HTMLImageElement;

// Todos los botones dentro del contenedor de login/registro
export const botones = document.querySelectorAll(
  ".login-registro button",
) as NodeListOf<HTMLButtonElement>;

// Fondo con efecto blur que se activa al abrir formularios
export const fondoblur = document.querySelector(".fondoblur") as HTMLElement;
