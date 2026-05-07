declare const lucide: any;

// define la estructura de datos de un gasto, incluye categoria opcional
interface GastoItem {
  id: number;
  monto: number;
  descripcion: string;
  categoria: string | null;
  fecha: string;
}

// define la estructura de datos de un ingreso, no tiene categoria
interface IngresoItem {
  id: number;
  monto: number;
  descripcion: string;
  fecha: string;
}

// tipo unificado que representa cualquier item seleccionable (gasto o ingreso)
type Item = GastoItem | IngresoItem;

// estado global del detalle actualmente visible
let itemActual: Item | null = null;
let esIngreso = false; // indica si el item actual es un ingreso (true) o gasto (false)
let editando = false; // indica si estamos en modo de edicion
let editTitle = ""; // valor temporal del titulo mientras se edita
let editDesc = ""; // valor temporal de la descripcion mientras se edita
let editMonto = ""; // valor temporal del monto mientras se edita

const cajaPrincipal = document.querySelector(".caja-principal") as HTMLDivElement;

// nombres de los meses en espanol para formatear fechas de forma legible
const nombresMes = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

// convierte una fecha ISO (yyyy-mm-dd) al formato "dd de Mes de yyyy"
function formatearFecha(fecha: string): string {
  const partes = fecha.split("-");
  if (partes.length === 3) {
    return `${partes[2]} de ${nombresMes[parseInt(partes[1]) - 1]} de ${partes[0]}`;
  }
  return fecha;
}

// determina si un item es un gasto verificando si tiene la propiedad categoria
function esGasto(item: Item): item is GastoItem {
  return "categoria" in item;
}

// obtiene la descripcion del item, retorna un texto por defecto si no tiene
function getDesc(item: Item): string {
  return item.descripcion || "Sin descripcion";
}

// escapa caracteres HTML especiales para prevenir inyeccion XSS
function escapeHtml(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// renderiza el detalle del item seleccionado en el panel principal, con modo vista y modo edicion
function renderizar() {
  if (!itemActual) {
    cajaPrincipal.innerHTML = `
      <div class="detalle-vacio">
        <p>Selecciona un gasto o ingreso para ver los detalles</p>
      </div>
    `;
    return;
  }

  const item = itemActual;
  const tipo = esGasto(item) ? "Gasto" : "Ingreso";
  const cat = esGasto(item) ? (item as GastoItem).categoria || "Sin categoria" : "Ingreso";
  const negativo = esGasto(item);

  const montoStr = `$${Number(item.monto).toFixed(2)}`;
  const fechaStr = formatearFecha(item.fecha);
  const titulo = escapeHtml(item.descripcion || tipo);
  const desc = escapeHtml(getDesc(item));

  if (editando) {
    // modo edicion: muestra campos de entrada para modificar titulo, descripcion y monto
    cajaPrincipal.innerHTML = `
      <div class="detalle-header">
        <div class="detalle-tags">
          <span class="detalle-badge ${negativo ? "detalle-badge-gasto" : "detalle-badge-ingreso"}">${tipo}</span>
          <span class="detalle-sep">/</span>
          <span class="detalle-cat">${cat.toLowerCase().replace(/\s+/g, "-")}</span>
        </div>
        <div class="detalle-acciones">
          <button class="detalle-btn detalle-btn-guardar" id="btnGuardarDetalle">
            <i data-lucide="check" class="icono-sm"></i>
          </button>
          <button class="detalle-btn detalle-btn-cancelar" id="btnCancelarDetalle">
            <i data-lucide="x" class="icono-sm"></i>
          </button>
        </div>
      </div>
      <div class="detalle-cuerpo">
        <input type="text" class="detalle-input-titulo" id="editTitulo" value="${escapeHtml(editTitle)}" placeholder="Titulo">
        <textarea class="detalle-textarea" id="editDesc" rows="3" placeholder="Descripcion...">${escapeHtml(editDesc)}</textarea>
        <div class="detalle-monto-box">
          <span class="detalle-monto-label">Monto total:</span>
          <div class="detalle-monto-edit">
            <span class="${negativo ? "detalle-monto-signo" : "detalle-monto-signo-positivo"}">${negativo ? "-$" : "+$"}</span>
            <input type="number" class="detalle-input-monto" id="editMonto" value="${editMonto}" step="0.01">
          </div>
        </div>
        <h2 class="detalle-subtitulo">Detalles del ${tipo.toLowerCase()}</h2>
        <ul class="detalle-notas-lista">
          <li class="detalle-nota-item">
            <span class="detalle-nota-bullet" style="background:${negativo ? "var(--red-400)" : "var(--green-500)"}"></span>
            <span class="detalle-nota-texto">Este ${tipo.toLowerCase()} fue registrado el ${fechaStr}</span>
          </li>
          <li class="detalle-nota-item">
            <span class="detalle-nota-bullet" style="background:var(--blue-400)"></span>
            <span class="detalle-nota-texto">Categorizado como ${cat}</span>
          </li>
          <li class="detalle-nota-item">
            <span class="detalle-nota-bullet" style="background:var(--gray-400)"></span>
            <span class="detalle-nota-texto">Monto de ${montoStr}</span>
          </li>
        </ul>
        <div class="detalle-info-adicional">
          <h3 class="detalle-info-titulo">Informacion adicional</h3>
          <div class="detalle-info-linea">
            <span class="detalle-info-label">Fecha:</span>
            <span>${fechaStr}</span>
          </div>
          <div class="detalle-info-linea">
            <span class="detalle-info-label">Categoria:</span>
            <div class="detalle-info-cat">
              <span class="detalle-cat-dot" style="background:${negativo ? "var(--red-400)" : "var(--green-500)"}"></span>
              <span>${cat}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  } else {
    // modo vista: muestra la informacion del item de forma legible con botones de accion
    cajaPrincipal.innerHTML = `
      <div class="detalle-header">
        <div class="detalle-tags">
          <span class="detalle-badge ${negativo ? "detalle-badge-gasto" : "detalle-badge-ingreso"}">${tipo}</span>
          <span class="detalle-sep">/</span>
          <span class="detalle-cat">${cat.toLowerCase().replace(/\s+/g, "-")}</span>
        </div>
        <div class="detalle-acciones">
          <button class="detalle-btn" id="btnEditarDetalle">
            <i data-lucide="pencil" class="icono-sm"></i>
          </button>
          <button class="detalle-btn detalle-btn-peligro" id="btnEliminarDetalle">
            <i data-lucide="trash-2" class="icono-sm"></i>
          </button>
        </div>
      </div>
      <div class="detalle-cuerpo">
        <h1 class="detalle-titulo">${titulo}</h1>
        <p class="detalle-desc">${desc}</p>
        <div class="detalle-monto-box">
          <span class="detalle-monto-label">Monto total:</span>
          <span class="detalle-monto-valor ${negativo ? "detalle-monto-negativo" : "detalle-monto-positivo"}">${negativo ? "-" : "+"}${montoStr}</span>
        </div>
        <h2 class="detalle-subtitulo">Detalles del ${tipo.toLowerCase()}</h2>
        <ul class="detalle-notas-lista">
          <li class="detalle-nota-item">
            <span class="detalle-nota-bullet" style="background:${negativo ? "var(--red-400)" : "var(--green-500)"}"></span>
            <span class="detalle-nota-texto">Este ${tipo.toLowerCase()} fue registrado el ${fechaStr}</span>
          </li>
          <li class="detalle-nota-item">
            <span class="detalle-nota-bullet" style="background:var(--blue-400)"></span>
            <span class="detalle-nota-texto">Categorizado como ${cat}</span>
          </li>
          <li class="detalle-nota-item">
            <span class="detalle-nota-bullet" style="background:var(--gray-400)"></span>
            <span class="detalle-nota-texto">Monto de ${montoStr}</span>
          </li>
        </ul>
        <div class="detalle-info-adicional">
          <h3 class="detalle-info-titulo">Informacion adicional</h3>
          <div class="detalle-info-linea">
            <span class="detalle-info-label">Fecha:</span>
            <span>${fechaStr}</span>
          </div>
          <div class="detalle-info-linea">
            <span class="detalle-info-label">Categoria:</span>
            <div class="detalle-info-cat">
              <span class="detalle-cat-dot" style="background:${negativo ? "var(--red-400)" : "var(--green-500)"}"></span>
              <span>${cat}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // actualiza los iconos SVG de lucide en el HTML renderizado
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }

  enlazarBotones();
}

// asigna los eventos a los botones de editar, guardar, cancelar y eliminar del detalle
function enlazarBotones() {
  const editar = document.getElementById("btnEditarDetalle");
  if (editar) {
    editar.onclick = () => {
      if (!itemActual) return;
      editTitle = itemActual.descripcion || "";
      editDesc = itemActual.descripcion || "";
      editMonto = Math.abs(Number(itemActual.monto)).toString();
      editando = true;
      renderizar();
    };
  }

  const guardar = document.getElementById("btnGuardarDetalle");
  if (guardar) {
    guardar.onclick = () => {
      if (!itemActual) return;
      const tituloEl = document.getElementById("editTitulo") as HTMLInputElement;
      const montoEl = document.getElementById("editMonto") as HTMLInputElement;
      if (!tituloEl || !montoEl) return;
      const nuevoMonto = parseFloat(montoEl.value) || 0;
      const nuevaDesc = tituloEl.value;
      if (esIngreso) {
        actualizarIngreso(itemActual.id, nuevaDesc, nuevoMonto);
      } else {
        actualizarGasto(itemActual.id, nuevaDesc, nuevoMonto);
      }
    };
  }

  const cancelar = document.getElementById("btnCancelarDetalle");
  if (cancelar) {
    cancelar.onclick = () => {
      editando = false;
      renderizar();
    };
  }

  const eliminar = document.getElementById("btnEliminarDetalle");
  if (eliminar) {
    eliminar.onclick = () => {
      if (!itemActual) return;
      if (esIngreso) {
        eliminarIngreso(itemActual.id);
      } else {
        eliminarGasto(itemActual.id);
      }
    };
  }
}

// establece el item actual como un gasto y renderiza su detalle en el panel principal
export function mostrarDetalle(item: GastoItem) {
  itemActual = item;
  esIngreso = false;
  editando = false;
  renderizar();
}

// establece el item actual como un ingreso y renderiza su detalle en el panel principal
function mostrarDetalleIngreso(item: IngresoItem) {
  itemActual = item;
  esIngreso = true;
  editando = false;
  renderizar();
}

// limpia la seleccion actual y muestra el mensaje de "Selecciona un gasto o ingreso..."
export function ocultarDetalle() {
  itemActual = null;
  editando = false;
  renderizar();
}

// envia los datos actualizados de un gasto al backend mediante PUT y refresca la interfaz
async function actualizarGasto(id: number, descripcion: string, monto: number) {
  const token = localStorage.getItem("token");
  if (!token) return;
  const g = itemActual as GastoItem;
  try {
    const res = await fetch(`http://localhost:3000/transacciones/gasto/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ monto, descripcion, categoria: g.categoria, fecha: g.fecha }),
    });
    if (res.ok) {
      itemActual = { ...g, descripcion, monto };
      editando = false;
      renderizar();
      window.dispatchEvent(new CustomEvent("resumen-actualizado"));
    } else {
      const err = await res.text();
      console.error("Error al actualizar gasto:", res.status, err);
    }
  } catch (error) {
    console.error("Error al actualizar gasto:", error);
  }
}

// envia los datos actualizados de un ingreso al backend mediante PUT y refresca la interfaz
async function actualizarIngreso(id: number, descripcion: string, monto: number) {
  const token = localStorage.getItem("token");
  if (!token) return;
  const ing = itemActual as IngresoItem;
  try {
    const res = await fetch(`http://localhost:3000/transacciones/ingreso/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ monto, descripcion, fecha: ing.fecha }),
    });
    if (res.ok) {
      itemActual = { ...ing, descripcion, monto };
      editando = false;
      renderizar();
      window.dispatchEvent(new CustomEvent("resumen-actualizado"));
    } else {
      const err = await res.text();
      console.error("Error al actualizar ingreso:", res.status, err);
    }
  } catch (error) {
    console.error("Error al actualizar ingreso:", error);
  }
}

// elimina un gasto del backend mediante DELETE y limpia la seleccion actual
async function eliminarGasto(id: number) {
  const token = localStorage.getItem("token");
  if (!token) return;
  try {
    const res = await fetch(`http://localhost:3000/transacciones/gasto/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      itemActual = null;
      renderizar();
      window.dispatchEvent(new CustomEvent("resumen-actualizado"));
    }
  } catch (error) {
    console.error("Error al eliminar gasto:", error);
  }
}

// elimina un ingreso del backend mediante DELETE y limpia la seleccion actual
async function eliminarIngreso(id: number) {
  const token = localStorage.getItem("token");
  if (!token) return;
  try {
    const res = await fetch(`http://localhost:3000/transacciones/ingreso/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      itemActual = null;
      renderizar();
      window.dispatchEvent(new CustomEvent("resumen-actualizado"));
    }
  } catch (error) {
    console.error("Error al eliminar ingreso:", error);
  }
}

// escucha el evento personalizado lanzado al hacer clic en un ingreso de la lista y muestra su detalle
window.addEventListener("mostrar-detalle-ingreso", ((e: CustomEvent) => {
  mostrarDetalleIngreso(e.detail);
}) as EventListener);

// al cargar el modulo, se muestra el estado vacio indicando que no hay item seleccionado
ocultarDetalle();
