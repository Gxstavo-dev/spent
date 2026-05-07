import { cerrarSesion } from "./cerrarSesion";

// referencias a los elementos del DOM del modal de gestion de cuenta
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

// cerrar el modal de cuenta al hacer clic en el boton de cerrar
btnCerrarCuenta.addEventListener("click", () => ventanaCuenta.close());

// cerrar sesion desde la ventana de cuenta, cierra el modal y ejecuta el cierre de sesion completo
btnCerrarSesionCuenta.addEventListener("click", () => {
  ventanaCuenta.close();
  cerrarSesion();
});

// obtiene los datos del usuario desde el backend y los muestra en la interfaz de cuenta
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

// ejecutamos la carga de datos de cuenta al inicializar el modulo
cargarDatosCuenta();

// al hacer clic en "cambiar nombre", se muestra el input con el nombre actual precargado
btnCambiarNombre.addEventListener("click", () => {
  inputNombre.value = cuentaNombre.textContent || "";
  editarNombreDiv.style.display = "block";
  inputNombre.focus();
});

// oculta el input de edicion de nombre sin guardar cambios
btnCancelarNombre.addEventListener("click", () => {
  editarNombreDiv.style.display = "none";
});

// envia el nombre actualizado al backend y refleja el cambio en la interfaz
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

// muestra el formulario para cambiar la contrasena y enfoca el campo de contrasena actual
btnCambiarContrasena.addEventListener("click", () => {
  editarContrasenaDiv.style.display = "block";
  inputContrasenaActual.focus();
});

// oculta el formulario de cambio de contrasena y limpia los campos
btnCancelarContrasena.addEventListener("click", () => {
  editarContrasenaDiv.style.display = "none";
  inputContrasenaActual.value = "";
  inputContrasenaNueva.value = "";
});

// envia la contrasena actual y la nueva al backend para actualizarla
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
