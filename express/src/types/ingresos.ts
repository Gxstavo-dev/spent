// Interfaz que define la estructura de un ingreso
// Corresponde a la tabla 'ingresos' en la base de datos
// Todas las propiedades son opcionales (?) porque pueden ser nulas antes de asignarse
export interface ingresos {
  id?: number;
  monto?: number;
  descripcion?: string;
  fecha?: string;
  fechadeCreacion?: string;
  fechadeActualizado?: string;
  idUsuario?: number;
}
