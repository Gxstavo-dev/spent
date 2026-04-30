// obtener el token guardado
export function obtenerToken() {
  const token = localStorage.getItem("token"); // lo habiamos almacenado en localStorage

  try {
    if (!token) {
      return null;
    }

    // tomar solo la segunda parte del token
    const dividirToken = token.split(".")[1];
    // atob para convertirlo en texto plano de base 64
    const decodificarToken = JSON.parse(atob(dividirToken));
    return decodificarToken;
  } catch (error) {
    console.error("Ocurrio un error: ", error);
    return null;
  }
}
