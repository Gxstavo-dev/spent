import { Database } from "bun:sqlite";
import path from "path";

const rutaDb = path.join(__dirname, "spentLocal.db");

const db = new Database(rutaDb);

async function execute({ sql, args }: { sql: string; args?: any[] }) {
  const tipo = sql.trim().toUpperCase().split(/\s+/)[0];

  if (tipo === "SELECT") {
    const stmt = db.query(sql);
    const rows = args ? stmt.all(...args) : stmt.all();
    return { rows: rows as any[], rowsAffected: 0, lastInsertRowid: 0 };
  } else {
    const resultado = args ? db.run(sql, ...args) : db.run(sql);
    return {
      rows: [],
      rowsAffected: Number(resultado.changes),
      lastInsertRowid: Number(resultado.lastInsertRowid),
    };
  }
}

function executeMultiple(sql: string) {
  db.exec(sql);
}

export const conexion = { execute, executeMultiple };
