// elimina los datos de sesion del almacenamiento local y redirige al login
export function cerrarSesion() {
  localStorage.removeItem("token");
  localStorage.removeItem("sesion");
  window.location.href = "../index.html";
}
