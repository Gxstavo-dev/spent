// funcion para cerrar sesion y eliminar el token
export function cerrarSesion() {
  localStorage.removeItem("token");
  window.location.href = "../index.html";
}
