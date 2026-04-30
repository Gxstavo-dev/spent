import { obtenerToken } from "./home/token";
import { cerrarSesion } from "./home/cerrarSesion";

const logout = document.getElementById("logout") as HTMLButtonElement;

// almacenar el token y es que esta guardado
const usuario = obtenerToken();

if (!usuario) {
  console.error("No contiene token");
} else {
  // guardamos el id y email que nos envia desde el backend
  const idUsuario = usuario.id;
  const email = usuario.email;
  console.log(idUsuario);
  console.log(email);
}

logout.addEventListener("click", () => {
  cerrarSesion();
});
