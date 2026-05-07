// lista completa de categorias disponibles para los gastos
const categorias = [
  "Personal", "Comida", "Transporte", "Trabajo", "Salud",
  "Entretenimiento", "Hogar", "Ropa", "Educacion", "Otros",
];

// obtiene del backend la cantidad de gastos por categoria y actualiza los indicadores numericos en la interfaz
export async function actualizarConteos() {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const res = await fetch("http://localhost:3000/transacciones/gastos/conteo", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) return;

    const datos = await res.json();

    // actualizamos el contador total de gastos
    const totalEl = document.getElementById("conteo-total");
    if (totalEl) totalEl.textContent = String(datos.total);

    // actualizamos el contador individual de cada categoria
    categorias.forEach((cat) => {
      const el = document.getElementById(`conteo-${cat}`);
      if (el) el.textContent = String(datos.conteo[cat] || 0);
    });
  } catch (error) {
    console.error("Error al actualizar conteos:", error);
  }
}

// ejecutamos la carga inicial de los conteos al cargar la pagina
actualizarConteos();

// cada vez que se dispare el evento de actualizacion, recargamos los conteos
window.addEventListener("resumen-actualizado", actualizarConteos);
