-- tabla de usuarios

CREATE TABLE IF NOT EXISTS usuarios(
    id                  INTEGER     PRIMARY KEY AUTOINCREMENT,
    email               TEXT        NOT NULL UNIQUE,
    nombre              TEXT        NOT NULL,
    contrasena          TEXT        NOT NULL,
    fechadeCreacion     DATETIME    DEFAULT CURRENT_TIMESTAMP,
    fechadeActualizado  DATETIME    DEFAULT CURRENT_TIMESTAMP
);

-- tabla de categorias

CREATE TABLE IF NOT EXISTS categorias(
    id                      INTEGER PRIMARY KEY AUTOINCREMENT,
    categoria               TEXT NOT NULL UNIQUE,
    descripcion             TEXT NOT NULL,
    color                   TEXT NOT NULL,
    tipo                    TEXT NOT NULL,
    fechadeCreacion         DATETIME DEFAULT CURRENT_TIMESTAMP,
    fechadeActualizado      DATETIME DEFAULT CURRENT_TIMESTAMP,
    idUsuario               INTEGER,
    FOREIGN KEY (idUsuario) REFERENCES usuarios(id)
);

-- tabla de gastos

CREATE TABLE IF NOT EXISTS gastos(
    id                          INTEGER PRIMARY KEY AUTOINCREMENT,
    -- manejo de datos double o float
    monto                       REAL NOT NULL,
    descripcion                 TEXT,
    fecha                       DATE NOT NULL,
    fechadeCreacion             DATETIME DEFAULT CURRENT_TIMESTAMP,
    fechadeActualizado          DATETIME DEFAULT CURRENT_TIMESTAMP,
    idUsuario                   INTEGER,
    idCategoria                 INTEGER,
    -- eliminacion en cascada, para eliminar todos los datos que se relacionen con las tablas
    FOREIGN KEY (idUsuario)     REFERENCES  usuarios    (id) ON DELETE CASCADE,
    FOREIGN KEY (idCategoria)   REFERENCES  categorias  (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ingresos(
    id                          INTEGER PRIMARY KEY AUTOINCREMENT,
    -- manejo de datos double o float
    monto                       REAL NOT NULL,
    descripcion                 TEXT,
    fecha                       DATE NOT NULL,
    fechadeCreacion             DATETIME DEFAULT CURRENT_TIMESTAMP,
    fechadeActualizado          DATETIME DEFAULT CURRENT_TIMESTAMP,
    idUsuario                   INTEGER,
    idCategoria                 INTEGER,
    -- eliminacion en cascada, para eliminar todos los datos que se relacionen con las tablas
    FOREIGN KEY (idUsuario)     REFERENCES  usuarios    (id) ON DELETE CASCADE,
    FOREIGN KEY (idCategoria)   REFERENCES  categorias  (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS notas(
    id                      INTEGER PRIMARY KEY AUTOINCREMENT,
    idUsuario               INTEGER NOT NULL,
    idReferencia            INTEGER NOT NULL,  -- id del gasto o ingreso
    tipo                    TEXT NOT NULL CHECK(tipo IN ('gasto', 'ingreso')),
    nota                    TEXT NOT NULL,     --  contenido de la nota
    fechadeCreacion         DATETIME DEFAULT CURRENT_TIMESTAMP,
    fechadeActualizado      DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idUsuario) REFERENCES usuarios(id) ON DELETE CASCADE,
    UNIQUE(idUsuario, idReferencia, tipo)      -- una nota por gasto/ingreso por usuario
);

CREATE TABLE IF NOT EXISTS presupuesto(
    id                      INTEGER PRIMARY KEY AUTOINCREMENT,
    idUsuario               INTEGER,
    monto                   REAL NOT NULL,
    mes                     INTEGER NOT NULL,
    anio                    INTEGER NOT NULL,
    FOREIGN KEY (idUsuario) REFERENCES usuarios(id) ON DELETE CASCADE,
    UNIQUE(idUsuario, mes, anio)
);

CREATE TABLE IF NOT EXISTS favoritos(
    id                      INTEGER PRIMARY KEY AUTOINCREMENT,
    idUsuario               INTEGER NOT NULL,
    idReferencia            INTEGER NOT NULL,   -- el id del gasto o ingreso
    tipo                    TEXT NOT NULL CHECK(tipo IN ('gasto', 'ingreso')), -- permitir solo esos dos valores
    FOREIGN KEY (idUsuario) REFERENCES usuarios(id) ON DELETE CASCADE,
    UNIQUE(idUsuario, idReferencia, tipo)
);
