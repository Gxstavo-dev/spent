// funcion para cerrar sesion y eliminar el token
export function cerrarSesion() {
  localStorage.removeItem("token");
  localStorage.removeItem("sesion");
  window.location.href = "../index.html";
}
