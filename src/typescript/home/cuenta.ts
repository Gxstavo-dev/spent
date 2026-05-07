import { cerrarSesion } from "./cerrarSesion";

const ventanaCuenta = document.getElementById(
  "ventana_Cuenta",
) as HTMLDialogElement;
const btnCerrarCuenta = document.getElementById(
  "btnCerrarCuenta",
) as HTMLButtonElement;
const btnCerrarSesionCuenta = document.getElementById(
  "btnCerrarSesionCuenta",
) as HTMLButtonElement;

btnCerrarCuenta.addEventListener("click", () => ventanaCuenta.close());

btnCerrarSesionCuenta.addEventListener("click", () => {
  ventanaCuenta.close();
  cerrarSesion();
});
