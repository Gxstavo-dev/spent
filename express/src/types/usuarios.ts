// Interfaz basada en la estructura de la tabla 'usuarios' de la base de datos
// Las propiedades opcionales (?) permiten omitir campos que aun no se han definido

// Interfaz para la tabla de usuarios
export interface Usuarios {
  id?: number;
  email?: string;
  nombre?: string;
  contrasena?: string;
  fechadeCreacion?: string;
  fechadeActualizado?: string;
}
