// estas intefaces estan basadas en como tengo estructurada la base de datos
// se puede ver en el archivo schemas.sql

// tener control sobre los datos que se ingresarar (que estaran permitidos )

// uso de ? despues de la clave es para hacerlo opcional y no sea requerido si o si

// para gastos
export interface gastos {
  id?: number;
  monto?: number;
  descripcion?: string;
  fecha?: string;
  fechadeCreacion?: string;
  fechadeActualizado?: string;
  idUsuario?: number;
}
