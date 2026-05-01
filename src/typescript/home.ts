import { obtenerToken } from "./home/token";
import { cerrarSesion } from "./home/cerrarSesion";

const logout = document?.getElementById("logout") as HTMLButtonElement;

// verificar que el token exista y sea valido
const usuario = obtenerToken();

if (!usuario) {
  console.error("No contiene token");
  window.location.href = "../index.html";
} else {
  const idUsuario = usuario.id;
  const email = usuario.email;
  console.log(idUsuario);
  console.log(email);
}

logout.addEventListener("click", () => {
  cerrarSesion();
});
