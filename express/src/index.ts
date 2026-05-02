// para iniciar el servidor
dotenv.config({ path: path.join(__dirname, ".env") });
import dotenv from "dotenv"; // usar archivo .env

import path from "path";
import app from "./app"; // importar la configuracion

const PORT = process.env.PORT || 3000; // si no es el puerto definido en .env usamos uno preterminado

// levantar servidor
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
