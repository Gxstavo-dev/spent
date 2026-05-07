// referencias para la ventana de ajustes
const ventanaAjustes = document.getElementById(
  "ventana_Ajustes",
) as HTMLDialogElement;
const btnCerrarAjustes = document.getElementById(
  "btnCerrarAjustes",
) as HTMLButtonElement;
const btnEliminarDatos = document.getElementById(
  "btnEliminarDatos",
) as HTMLButtonElement;

// cerramos la ventana
btnCerrarAjustes.addEventListener("click", () => ventanaAjustes.close());

// cuando le picamos a eliminar datos, manda peticion al backend
btnEliminarDatos.addEventListener("click", async () => {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const respuesta = await fetch("http://localhost:3000/transacciones/datos", {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (respuesta.ok) {
      ventanaAjustes.close(); // cerramos la ventana
      window.dispatchEvent(new CustomEvent("resumen-actualizado")); // recargamos todo
    }
  } catch (error) {
    console.error("Error al eliminar datos:", error);
  }
});
