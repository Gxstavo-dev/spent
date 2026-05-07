const cerrarPresupuesto = document.getElementById("btnCerrarPresupuesto") as HTMLButtonElement;
const guardarPresupuesto = document.getElementById("btnGuardarPresupuesto") as HTMLButtonElement;
const dialogPresupuesto = document.getElementById("ventana_Presupuesto") as HTMLDialogElement;
const montoPresupuesto = document.getElementById("presupuestoMonto") as HTMLInputElement;
const mesPresupuesto = document.getElementById("presupuestoMes") as HTMLSelectElement;

const meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
mesPresupuesto.value = meses[new Date().getMonth()];

cerrarPresupuesto.addEventListener("click", () => dialogPresupuesto.close());

guardarPresupuesto.addEventListener("click", async () => {
  const token = localStorage.getItem("token");
  if (!token) return;

  const monto = parseFloat(montoPresupuesto.value) || 0;
  if (monto <= 0) return;

  try {
    const respuesta = await fetch("http://localhost:3000/transacciones/presupuesto", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        monto,
        mes: mesPresupuesto.value,
      }),
    });

    if (respuesta.ok) {
      montoPresupuesto.value = "";
      dialogPresupuesto.close();
      window.dispatchEvent(new CustomEvent("resumen-actualizado"));
    }
  } catch (error) {
    console.error("Error al guardar presupuesto:", error);
  }
});
