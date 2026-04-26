// para iniciar el servidor
import "dotenv/config"; // usar archivo .env
import app from "./app"; // importar la configuracion

const PORT = process.env.PORT || 3000; // si no es el puerto definido en .env usamos uno preterminado

// levantar servidor
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
