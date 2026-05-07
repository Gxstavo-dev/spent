const cerrarIngreso = document.getElementById("btnCerrarIngreso") as HTMLButtonElement;
const guardarIngreso = document.getElementById("btnGuardarIngreso") as HTMLButtonElement;
const dialogIngreso = document.getElementById("ventana_Ingreso") as HTMLDialogElement;
const montoIngreso = document.getElementById("ingresoMonto") as HTMLInputElement;
const descIngreso = document.getElementById("ingresoDescripcion") as HTMLInputElement;
const fechaIngreso = document.getElementById("ingresoFecha") as HTMLInputElement;

fechaIngreso.value = new Date().toISOString().split("T")[0];

cerrarIngreso.addEventListener("click", () => dialogIngreso.close());

guardarIngreso.addEventListener("click", async () => {
  const token = localStorage.getItem("token");
  if (!token) return;

  const monto = parseFloat(montoIngreso.value) || 0;
  if (monto <= 0) return;

  try {
    const respuesta = await fetch("http://localhost:3000/transacciones/ingreso", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        monto,
        descripcion: descIngreso.value,
        fecha: fechaIngreso.value,
      }),
    });

    if (respuesta.ok) {
      montoIngreso.value = "";
      descIngreso.value = "";
      dialogIngreso.close();
      window.dispatchEvent(new CustomEvent("resumen-actualizado"));
    }
  } catch (error) {
    console.error("Error al guardar ingreso:", error);
  }
});
