// contenedor donde se renderiza la lista de ingresos en la subbarra lateral
const listaIngresos = document.getElementById(
  "lista-ingresos",
) as HTMLDivElement;

// convierte una fecha en formato ISO (yyyy-mm-dd) a formato legible dd/mm/yyyy
function formatearFecha(fecha: string): string {
  const partes = fecha.split("-");
  if (partes.length === 3) {
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }
  return fecha;
}

// genera los elementos HTML para cada ingreso y los inserta en el contenedor
function renderizarIngresos(
  items: { id: number; monto: number; descripcion: string; fecha: string }[],
) {
  listaIngresos.innerHTML = "";

  if (items.length === 0) {
    listaIngresos.innerHTML =
      '<div class="vacio-lista">No hay ingresos</div>';
    return;
  }

  items.forEach((item) => {
    const div = document.createElement("div");
    div.className = "item-gasto";
    div.innerHTML = `
      <div class="info-gasto">
        <span class="desc-gasto">${item.descripcion || "Sin descripcion"}</span>
        <span class="fecha-gasto">${formatearFecha(item.fecha)}</span>
      </div>
      <span class="monto-ingreso">+$${Number(item.monto).toFixed(2)}</span>
    `;
    // al hacer clic en un ingreso, se dispara un evento personalizado para mostrar su detalle
    div.addEventListener("click", () => {
      const event = new CustomEvent("mostrar-detalle-ingreso", {
        detail: item,
      });
      window.dispatchEvent(event);
    });
    listaIngresos.appendChild(div);
  });
}

// obtiene la lista de ingresos desde el backend
export async function cargarIngresos() {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const res = await fetch("http://localhost:3000/transacciones/ingresos", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      const ingresos = await res.json();
      renderizarIngresos(ingresos);
    }
  } catch (error) {
    console.error("Error al cargar ingresos:", error);
  }
}

// cuando ocurre un cambio en los datos, recargamos la lista si la subbarra de ingresos esta visible
window.addEventListener("resumen-actualizado", () => {
  const sub = document.getElementById("subBarralateral") as HTMLElement;
  const ing = document.getElementById("subbarra-ingresos") as HTMLElement;
  if (sub.classList.contains("mostrarBarra") && ing.style.display !== "none") {
    cargarIngresos();
  }
});
