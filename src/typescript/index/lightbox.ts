// Importamos los elementos necesarios
import { lightbox, articuloImagen } from "./elementos";

// Al hacer click en la imagen del articulo, se muestra el lightbox
articuloImagen.addEventListener("click", () => {
  lightbox.classList.add("active");
});

// Al hacer click en el lightbox, se cierra (se quita la clase active)
lightbox.addEventListener("click", () => {
  lightbox.classList.remove("active");
});
