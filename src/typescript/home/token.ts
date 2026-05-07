// obtiene el token del localStorage y lo decodifica para extraer los datos del usuario
export function obtenerToken() {
  const token = localStorage.getItem("token");

  try {
    if (!token) {
      return null;
    }

    // el token JWT tiene 3 partes separadas por puntos, la segunda parte tiene los datos del usuario
    const dividirToken = token.split(".")[1];
    // decodificamos de base64 a JSON y lo retornamos como objeto
    const decodificarToken = JSON.parse(atob(dividirToken));
    return decodificarToken;
  } catch (error) {
    console.error("Ocurrio un error: ", error);
    return null;
  }
}
