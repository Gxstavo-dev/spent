// importacion de modulos separados
import { formularios } from "./index/formularios.js";
import { formLogin, formRegistro } from "./index/elementos.js";
import "./index/ui.js";
import "./index/lightbox.js";

// manejo de logica para guardado de sesion y no tener que iniciar sesion a cada rato
const sesionGuardada = localStorage.getItem("token");

// validar token con el backend antes de redirigir
if (sesionGuardada) {
  (async () => {
    try {
      const respuesta = await fetch(
        "http://localhost:3000/usuarios/verificar",
        {
          method: "GET",
          headers: { Authorization: `Bearer ${sesionGuardada}` },
        },
      );
      if (respuesta.ok) {
        window.location.href = "/src/pages/home.html";
      } else {
        localStorage.removeItem("token");
      }
    } catch (error) {
      localStorage.removeItem("token");
    }
  })();
}

// form de login
formLogin.addEventListener("submit", async (e) => {
  try {
    e.preventDefault();
    const formdata = new FormData(formLogin);
    const objetos = Object.fromEntries(formdata.entries());
    const datos = await formularios("login", objetos);

    // guardar token y datos de sesion juntos
    localStorage.setItem("token", datos.token);
    localStorage.setItem(
      "sesion",
      JSON.stringify({ id: datos.id, email: datos.email }),
    );

    // redirigir a home sin exponer el id en la URL
    window.location.href = "/src/pages/home.html";
  } catch (error) {
    console.error("Ocurrio un error:", error);
  }
});

// form de registro
formRegistro.addEventListener("submit", async (e) => {
  try {
    e.preventDefault();
    const formdata = new FormData(formRegistro);
    const objetos = Object.fromEntries(formdata.entries());
    await formularios("registro", objetos);
  } catch (error) {
    console.error("Ocurrio un error:", error);
  }
});
