const listaGastos = document.getElementById(
  "lista-gastos-categoria",
) as HTMLDivElement;

let filtroCategoria: string | null = null;

function formatearFecha(fecha: string): string {
  const partes = fecha.split("-");
  if (partes.length === 3) {
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }
  return fecha;
}

function renderizarGastos(
  items: { id: number; monto: number; descripcion: string; categoria: string | null; fecha: string }[],
) {
  listaGastos.innerHTML = "";

  if (items.length === 0) {
    listaGastos.innerHTML =
      '<div class="vacio-lista">No hay gastos</div>';
    return;
  }

  items.forEach((item) => {
    const div = document.createElement("div");
    div.className = "item-gasto";
    div.innerHTML = `
      <div class="info-gasto">
        <span class="cat-gasto">${item.categoria || "Sin categoria"}</span>
        <span class="desc-gasto">${item.descripcion || "Sin descripción"}</span>
        <span class="fecha-gasto">${formatearFecha(item.fecha)}</span>
      </div>
      <span class="monto-gasto">$${Number(item.monto).toFixed(2)}</span>
    `;
    listaGastos.appendChild(div);
  });
}

export async function cargarGastos(categoria?: string) {
  const token = localStorage.getItem("token");
  if (!token) return;

  filtroCategoria = categoria || null;

  try {
    let url = "http://localhost:3000/transacciones/gastos";
    if (categoria) {
      url += `?categoria=${encodeURIComponent(categoria)}`;
    }

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      const gastos = await res.json();
      renderizarGastos(gastos);
    }
  } catch (error) {
    console.error("Error al cargar gastos:", error);
  }
}

export function iniciarCategorias() {
  cargarGastos();
}

// cuando se crea un gasto, recargamos si el subBarraLateral esta abierto
window.addEventListener("resumen-actualizado", () => {
  const sub = document.getElementById("subBarralateral") as HTMLElement;
  const cat = document.getElementById("subbarra-categorias") as HTMLElement;
  if (sub.classList.contains("mostrarBarra") && cat.style.display !== "none") {
    cargarGastos(filtroCategoria || undefined);
  }
});
