// Las interfaces aqui definidas reflejan la estructura de las tablas en la base de datos
// Consulte el archivo schemas.sql para mayor contexto sobre las columnas y tipos

// El signo de interrogacion (?) indica que la propiedad es opcional, no obligatoria

// Interfaz para la tabla de gastos
export interface gastos {
  id?: number;
  monto?: number;
  descripcion?: string;
  fecha?: string;
  fechadeCreacion?: string;
  fechadeActualizado?: string;
  idUsuario?: number;
}
