import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, ".env") });

import app from "./app";
import { conexion } from "./lib/local/Database";
import { SCHEMA_SQL } from "./lib/local/schema";

if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = "9x$Kv2n!Qw8@pLm*R7tYb3#Jh5^dFg6&NjKp2$Ws5*Zq8!XcVb@Mn4^TfGy7&HjKl9";
}

conexion.executeMultiple(SCHEMA_SQL);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
