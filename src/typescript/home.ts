import { obtenerToken } from "./home/token.js";
import { cerrarSesion } from "./home/cerrarSesion.js";
import { logout } from "./home/elementos.js";
import "./home/ui.js";

// verificar que el token exista y sea valido
const usuario = obtenerToken();

if (!usuario) {
  console.error("No contiene token");
  window.location.href = "../index.html";
}

logout.addEventListener("click", () => {
  cerrarSesion();
});
