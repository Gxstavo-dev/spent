const cerrarGasto = document.getElementById("btnCerrarGasto") as HTMLButtonElement;
const guardarGasto = document.getElementById("btnGuardarGasto") as HTMLButtonElement;
const dialogGasto = document.getElementById("ventana_Gasto") as HTMLDialogElement;
const montoGasto = document.getElementById("gastoMonto") as HTMLInputElement;
const descGasto = document.getElementById("gastoDescripcion") as HTMLInputElement;
const catGasto = document.getElementById("gastoCategoria") as HTMLSelectElement;
const fechaGasto = document.getElementById("gastoFecha") as HTMLInputElement;

fechaGasto.value = new Date().toISOString().split("T")[0];

cerrarGasto.addEventListener("click", () => dialogGasto.close());

guardarGasto.addEventListener("click", async () => {
  const token = localStorage.getItem("token");
  if (!token) return;

  const monto = parseFloat(montoGasto.value) || 0;
  if (monto <= 0) return;

  try {
    const respuesta = await fetch("http://localhost:3000/transacciones/gasto", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        monto,
        descripcion: descGasto.value,
        categoria: catGasto.value,
        fecha: fechaGasto.value,
      }),
    });

    if (respuesta.ok) {
      montoGasto.value = "";
      descGasto.value = "";
      dialogGasto.close();
      window.dispatchEvent(new CustomEvent("resumen-actualizado"));
    }
  } catch (error) {
    console.error("Error al guardar gasto:", error);
  }
});
