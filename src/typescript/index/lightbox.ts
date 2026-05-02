// manejo del lightbox para las imagenes
import { articuloImagen, lightbox } from "./elementos";

// abrir lightbox al hacer click en la imagen
articuloImagen.addEventListener("click", () => {
  lightbox.classList.add("active");
});

// cerrar lightbox al hacer click en el
lightbox.addEventListener("click", () => {
  lightbox.classList.remove("active");
});
