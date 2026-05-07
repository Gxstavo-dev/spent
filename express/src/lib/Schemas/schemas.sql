-- tabla de usuarios

CREATE TABLE IF NOT EXISTS usuarios(
    id                  INTEGER     PRIMARY KEY AUTOINCREMENT,
    email               TEXT        NOT NULL UNIQUE,
    nombre              TEXT        NOT NULL,
    contrasena          TEXT        NOT NULL,
    fechadeCreacion     DATETIME    DEFAULT CURRENT_TIMESTAMP,
    fechadeActualizado  DATETIME    DEFAULT CURRENT_TIMESTAMP
);

-- tabla de gastos

CREATE TABLE IF NOT EXISTS gastos(
    id                          INTEGER PRIMARY KEY AUTOINCREMENT,
    -- manejo de datos double o float
    monto                       REAL NOT NULL,
    descripcion                 TEXT,
    categoria                   TEXT,
    fecha                       DATE NOT NULL,
    fechadeCreacion             DATETIME DEFAULT CURRENT_TIMESTAMP,
    fechadeActualizado          DATETIME DEFAULT CURRENT_TIMESTAMP,
    idUsuario                   INTEGER,
    -- eliminacion en cascada, para eliminar todos los datos que se relacionen con las tablas
    FOREIGN KEY (idUsuario)     REFERENCES  usuarios    (id) ON DELETE CASCADE
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
    -- eliminacion en cascada, para eliminar todos los datos que se relacionen con las tablas
    FOREIGN KEY (idUsuario)     REFERENCES  usuarios    (id) ON DELETE CASCADE
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


