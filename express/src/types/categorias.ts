// estas intefaces estan basadas en como tengo estructurada la base de datos
// se puede ver en el archivo schemas.sql
// tener control sobre los datos que se ingresarar (que estaran permitidos )

// uso de ? despues de la clave es para hacerlo opcional y no sea requerido si o si

// para categorias
export interface categorias {
  id?: number;
  tipo?: string;
  categoria?: string;
  descripcion?: string;
  color?: string;
  fechadeCreacion?: string;
  fechadeActualizado?: string;
  idUsuario?: number;
}
