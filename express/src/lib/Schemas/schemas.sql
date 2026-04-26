-- tabla de usuarios

CREATE TABLE IF NOT EXISTS usuarios(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    nombre TEXT NOT NULL,
    contrasena TEXT NOT NULL,
    fechadeCreacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fechadeActualizado DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- tabla de categorias

CREATE TABLE IF NOT EXISTS categorias(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    categoria TEXT NOT NULL UNIQUE,
    descripcion TEXT NOT NULL,
    color TEXT NOT NULL,
    tipo TEXT NOT NULL,
    fechadeCreacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fechadeActualizado DATETIME DEFAULT CURRENT_TIMESTAMP,
    idUsuario INTEGER,
    FOREIGN KEY (idUsuario) REFERENCES usuarios(id)
);

-- tabla de gastos

CREATE TABLE IF NOT EXISTS gastos(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    -- manejo de datos double o float
    monto REAL NOT NULL,
    descripcion TEXT,
    fecha DATE NOT NULL,
    fechadeCreacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fechadeActualizado DATETIME DEFAULT CURRENT_TIMESTAMP,
    idUsuario INTEGER,
    idCategoria INTEGER,
    -- eliminacion en cascada, para eliminar todos los datos que se relacionen con las tablas
    FOREIGN KEY (idUsuario) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (idCategoria) REFERENCES  categorias(id) ON DELETE CASCADE
);
