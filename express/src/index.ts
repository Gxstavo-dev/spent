import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, ".env") });

import app from "./app";
import { conexion } from "./lib/local/Database";
import { SCHEMA_SQL } from "./lib/local/schema";

conexion.executeMultiple(SCHEMA_SQL);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
