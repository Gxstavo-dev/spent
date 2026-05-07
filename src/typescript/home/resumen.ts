const resumenGastos = document.getElementById("resumenGastos") as HTMLSpanElement;
const resumenPresupuesto = document.getElementById("resumenPresupuesto") as HTMLSpanElement;
const resumenBalance = document.getElementById("resumenBalance") as HTMLSpanElement;

function formatearMonto(monto: number): string {
  return `$${monto.toFixed(2)}`;
}

export async function actualizarResumen() {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const respuesta = await fetch("http://localhost:3000/transacciones/resumen", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!respuesta.ok) return;

    const datos = await respuesta.json();

    if (resumenGastos) {
      resumenGastos.textContent = formatearMonto(datos.gastos);
    }
    if (resumenPresupuesto) {
      resumenPresupuesto.textContent = formatearMonto(datos.presupuesto);
    }
    if (resumenBalance) {
      resumenBalance.textContent = formatearMonto(datos.balance);
    }
  } catch (error) {
    console.error("Error al actualizar resumen:", error);
  }
}

window.addEventListener("resumen-actualizado", actualizarResumen);

actualizarResumen();
