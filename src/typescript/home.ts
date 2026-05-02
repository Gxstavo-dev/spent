import { obtenerToken } from "./home/token";
import { cerrarSesion } from "./home/cerrarSesion";
import { logout } from "./home/elementos";
// verificar que el token exista y sea valido
const usuario = obtenerToken();

if (!usuario) {
  console.error("No contiene token");
  window.location.href = "../index.html";
}

logout.addEventListener("click", () => {
  cerrarSesion();
});
