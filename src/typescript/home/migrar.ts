const ventanaMigrar = document.getElementById("ventana_MigrarDatabase") as HTMLDialogElement;
const opciones = ventanaMigrar.querySelectorAll(".opcion-migrar") as NodeListOf<HTMLButtonElement>;
const btnContinuar = document.getElementById("btnContinuarMigrar") as HTMLButtonElement;
const btnCancelar = document.getElementById("btnCancelarMigrar") as HTMLButtonElement;
const cerrarMigrar = document.getElementById("btnCerrarMigrar") as HTMLButtonElement;

let opcionSeleccionada: string | null = null;

opciones.forEach((opcion) => {
  opcion.addEventListener("click", () => {
    opciones.forEach((o) => o.classList.remove("activo"));
    opcion.classList.add("activo");
    opcionSeleccionada = opcion.getAttribute("data-opcion");
    btnContinuar.disabled = false;
  });
});

btnCancelar.addEventListener("click", () => ventanaMigrar.close());
cerrarMigrar.addEventListener("click", () => ventanaMigrar.close());

ventanaMigrar.addEventListener("close", () => {
  opciones.forEach((o) => o.classList.remove("activo"));
  opcionSeleccionada = null;
  btnContinuar.disabled = true;
});

btnContinuar.addEventListener("click", () => {
  if (!opcionSeleccionada) return;
  ventanaMigrar.close();
});
