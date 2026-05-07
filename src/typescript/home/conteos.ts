const categorias = [
  "Personal", "Comida", "Transporte", "Trabajo", "Salud",
  "Entretenimiento", "Hogar", "Ropa", "Educacion", "Otros",
];

export async function actualizarConteos() {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const res = await fetch("http://localhost:3000/transacciones/gastos/conteo", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) return;

    const datos = await res.json();

    const totalEl = document.getElementById("conteo-total");
    if (totalEl) totalEl.textContent = String(datos.total);

    categorias.forEach((cat) => {
      const el = document.getElementById(`conteo-${cat}`);
      if (el) el.textContent = String(datos.conteo[cat] || 0);
    });
  } catch (error) {
    console.error("Error al actualizar conteos:", error);
  }
}

actualizarConteos();

window.addEventListener("resumen-actualizado", actualizarConteos);
