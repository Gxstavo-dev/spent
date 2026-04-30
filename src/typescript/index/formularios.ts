// funcion para manejar ambos formularios login y registro
export async function formularios(
  tipo: string,
  objetos: Record<string, FormDataEntryValue>, // para que acepte cmo parametro las claves del formdata
) {
  try {
    if (tipo === "login") {
      console.log("datos desde frontend", objetos);
      // el endpoint para iniciar sesion esto retorna el token
      const respuesta = await fetch("http://localhost:3000/usuarios/login", {
        method: "POST",
        // envio de datos en formato json
        body: JSON.stringify({
          email: objetos.email,
          contrasena: objetos.contrasena,
        }),
        credentials: "include", // para enviar o recibir cookies
        headers: { "Content-Type": "application/json" },
      });

      if (!respuesta.ok) {
        throw new Error(`Error -> ${respuesta.status}`);
      }

      const datos = await respuesta.json();
      return datos;
    }

    if (tipo === "registro") {
      console.log("datos desde frontend", objetos);
      const respuesta = await fetch("http://localhost:3000/usuarios/registro", {
        method: "POST",
        body: JSON.stringify({
          email: objetos.email,
          nombre: objetos.nombre,
          contrasena: objetos.contrasena,
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (!respuesta.ok) {
        throw new Error(`Error -> ${respuesta.status}`);
      }

      const datos = await respuesta.json();
      return datos;
    }
  } catch (error) {
    console.error("Error en formularios:", error);
    throw error;
  }
}
