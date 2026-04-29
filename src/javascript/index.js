const lightbox = document.getElementById("lightbox");
const articuloImagen = document.querySelector(".articulo img");

const botones = document.querySelectorAll(".login-registro button");
const fondoblur = document.querySelector(".fondoblur");

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const popovers = document.querySelectorAll(":popover-open");
    popovers.forEach((popover) => {
      popover.hidePopover();
    });
    fondoblur.classList.remove("activado");
    botones.forEach((b) => b.classList.remove("activo"));
  }
});

botones.forEach((boton) => {
  boton.addEventListener("click", () => {
    const estaActivo = boton.classList.contains("activo");
    fondoblur.classList.add("activado");

    // quitamos activo de tods
    botones.forEach((b) => {
      b.classList.remove("activo");
    });

    if (!estaActivo) {
      boton.classList.add("activo");
    } else {
      fondoblur.classList.remove("activado");
    }
  });
});

// para centrar la imagen
articuloImagen.addEventListener("click", () => {
  lightbox.classList.add("active");
});

lightbox.addEventListener("click", () => {
  lightbox.classList.remove("active");
});
