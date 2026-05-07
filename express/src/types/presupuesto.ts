// Interfaz que define la estructura de un presupuesto mensual
// Corresponde a la tabla 'presupuesto' en la base de datos
export interface presupuesto {
  id?: number;
  idUsuario?: number;
  monto?: number;
  mes?: number;
  anio?: number;
}
