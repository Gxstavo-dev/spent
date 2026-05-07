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
const cuentaEmail = document.getElementById("cuentaEmail") as HTMLParagraphElement;
const cuentaNombre = document.getElementById("cuentaNombre") as HTMLParagraphElement;
const barraCuentaEmail = document.getElementById("barraCuentaEmail") as HTMLSpanElement;
const btnCambiarNombre = document.getElementById(
  "btnCambiarNombre",
) as HTMLButtonElement;
const editarNombreDiv = document.getElementById(
  "editarNombreDiv",
) as HTMLDivElement;
const inputNombre = document.getElementById("inputNombre") as HTMLInputElement;
const btnGuardarNombre = document.getElementById(
  "btnGuardarNombre",
) as HTMLButtonElement;
const btnCancelarNombre = document.getElementById(
  "btnCancelarNombre",
) as HTMLButtonElement;
const btnCambiarContrasena = document.getElementById(
  "btnCambiarContrasena",
) as HTMLButtonElement;
const editarContrasenaDiv = document.getElementById(
  "editarContrasenaDiv",
) as HTMLDivElement;
const inputContrasenaActual = document.getElementById(
  "inputContrasenaActual",
) as HTMLInputElement;
const inputContrasenaNueva = document.getElementById(
  "inputContrasenaNueva",
) as HTMLInputElement;
const btnGuardarContrasena = document.getElementById(
  "btnGuardarContrasena",
) as HTMLButtonElement;
const btnCancelarContrasena = document.getElementById(
  "btnCancelarContrasena",
) as HTMLButtonElement;

btnCerrarCuenta.addEventListener("click", () => ventanaCuenta.close());

btnCerrarSesionCuenta.addEventListener("click", () => {
  ventanaCuenta.close();
  cerrarSesion();
});

// cargamos los datos del usuario cuando se carga la pagina
async function cargarDatosCuenta() {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const respuesta = await fetch("http://localhost:3000/usuarios/mi-cuenta", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (respuesta.ok) {
      const datos = await respuesta.json();
      cuentaEmail.textContent = datos.email;
      cuentaNombre.textContent = datos.nombre;
      barraCuentaEmail.textContent = `Cuenta:${datos.email}`;
    }
  } catch (error) {
    console.error("Error al cargar datos de la cuenta:", error);
  }
}

cargarDatosCuenta();

// mostrar el div para editar nombre
btnCambiarNombre.addEventListener("click", () => {
  inputNombre.value = cuentaNombre.textContent || "";
  editarNombreDiv.style.display = "block";
  inputNombre.focus();
});

// cancelar edicion de nombre
btnCancelarNombre.addEventListener("click", () => {
  editarNombreDiv.style.display = "none";
});

// guardar nombre nuevo
btnGuardarNombre.addEventListener("click", async () => {
  const nombreNuevo = inputNombre.value.trim();
  if (!nombreNuevo) return;

  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const respuesta = await fetch("http://localhost:3000/usuarios/cambiar-nombre", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ nombre: nombreNuevo }),
    });

    if (respuesta.ok) {
      cuentaNombre.textContent = nombreNuevo;
      editarNombreDiv.style.display = "none";
    }
  } catch (error) {
    console.error("Error al cambiar nombre:", error);
  }
});

// mostrar el div para cambiar contraseña
btnCambiarContrasena.addEventListener("click", () => {
  editarContrasenaDiv.style.display = "block";
  inputContrasenaActual.focus();
});

// cancelar cambio de contraseña
btnCancelarContrasena.addEventListener("click", () => {
  editarContrasenaDiv.style.display = "none";
  inputContrasenaActual.value = "";
  inputContrasenaNueva.value = "";
});

// guardar contraseña nueva
btnGuardarContrasena.addEventListener("click", async () => {
  const contrasenaActual = inputContrasenaActual.value;
  const contrasenaNueva = inputContrasenaNueva.value;

  if (!contrasenaActual || !contrasenaNueva) return;
  if (contrasenaNueva.length < 6) return;

  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const respuesta = await fetch("http://localhost:3000/usuarios/cambiar-contrasena", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ contrasenaActual, contrasenaNueva }),
    });

    if (respuesta.ok) {
      editarContrasenaDiv.style.display = "none";
      inputContrasenaActual.value = "";
      inputContrasenaNueva.value = "";
    }
  } catch (error) {
    console.error("Error al cambiar contraseña:", error);
  }
});
