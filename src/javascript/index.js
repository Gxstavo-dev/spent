const lightbox = document.getElementById("lightbox");
const articuloImagen = document.querySelector(".articulo img");
const github = document.querySelector(".github");

articuloImagen.addEventListener("click", () => {
  lightbox.classList.add("active");
});

lightbox.addEventListener("click", () => {
  lightbox.classList.remove("active");
});
