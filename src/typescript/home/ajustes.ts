const ventanaAjustes = document.getElementById(
  "ventana_Ajustes",
) as HTMLDialogElement;
const btnCerrarAjustes = document.getElementById(
  "btnCerrarAjustes",
) as HTMLButtonElement;
const btnEliminarDatos = document.getElementById(
  "btnEliminarDatos",
) as HTMLButtonElement;

btnCerrarAjustes.addEventListener("click", () => ventanaAjustes.close());

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
      ventanaAjustes.close();
      window.dispatchEvent(new CustomEvent("resumen-actualizado"));
    }
  } catch (error) {
    console.error("Error al eliminar datos:", error);
  }
});
