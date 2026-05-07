// referencias a los elementos del DOM que muestran los valores del resumen en la barra lateral
const resumenGastos = document.getElementById("resumenGastos") as HTMLSpanElement;
const resumenPresupuesto = document.getElementById("resumenPresupuesto") as HTMLSpanElement;
const resumenBalance = document.getElementById("resumenBalance") as HTMLSpanElement;

// formatea un numero con el signo de pesos y dos decimales
function formatearMonto(monto: number): string {
  return `$${monto.toFixed(2)}`;
}

// obtiene del backend los totales de gastos, presupuesto y balance y los muestra en la interfaz
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

// suscripcion al evento global para refrescar el resumen cuando cambian los datos
window.addEventListener("resumen-actualizado", actualizarResumen);

// carga inicial del resumen al cargar el modulo
actualizarResumen();
