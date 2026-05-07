import { obtenerToken } from "./home/token.js";
import { cerrarSesion } from "./home/cerrarSesion.js";
import { logout } from "./home/elementos.js";
import "./home/ui.js";
import "./home/categorias.js";
import "./home/conteos.js";
import "./home/cuenta.js";
import "./home/ajustes.js";
import "./home/ingreso.js";
import "./home/gasto.js";
import "./home/presupuesto.js";
import "./home/resumen.js";
import "./home/ingresosList.js";
import "./home/detalle.js";

// verificamos que el usuario tenga un token valido antes de cargar la pagina
const usuario = obtenerToken();

if (!usuario) {
  console.error("No contiene token");
  window.location.href = "../index.html";
}

// asignamos el evento de cierre de sesion al boton de logout
logout.addEventListener("click", () => {
  cerrarSesion();
});
