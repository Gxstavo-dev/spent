import { formularios } from "./index/formularios.ts"; // funcion para manejar los formularios ambos estan en la misma funcion

// para poder usarlos en formularios.ts funcion formularios
export const formLogin = document.getElementById(
  "formLogin",
) as HTMLFormElement;

export const formRegistro = document.getElementById(
  "formRegistro",
) as HTMLFormElement;

// form de login
// enviamos los claves y propiedades a la funcion para que los enviemos en json
formLogin.addEventListener("submit", async (e) => {
  try {
    e.preventDefault();
    const formdata = new FormData(formLogin); // crear objeto para tomar todos los inputs
    const objetos = Object.fromEntries(formdata.entries()); // agarrar esos inputs
    const datos = await formularios("login", objetos);
    console.log(datos);
    localStorage.setItem("token", datos.token); // guardar el token retornado

    // redirigir a home
    window.location.href = "/src/pages/home.html";
  } catch (error) {
    console.error("Ocurrio un error:", error);
  }
});

// form de registro
formRegistro.addEventListener("submit", async (e) => {
  try {
    e.preventDefault();
    const formdata = new FormData(formRegistro);
    const objetos = Object.fromEntries(formdata.entries());
    await formularios("registro", objetos);
  } catch (error) {
    console.error("Ocurrio un error:", error);
  }
});

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
