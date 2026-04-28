# Documentación del Proyecto Spent

## Descripción General

**Spent** es una aplicación de escritorio para gestionar gastos personales. Permite a los usuarios:

- Registrar sus gastos e ingresos
- Organizarlos por categorías
- Ver resúmenes y reportes de sus finanzas
- Almacenar datos localmente (SQLite)
- Subir a la nube cuando lo necesite (Turso)

**Plataforma actual:** Linux (Arch Linux y derivadas)

---

## Tecnologías

### Frontend: Vanilla JavaScript + Tauri
- **Tauri** es un framework para crear apps de escritorio usando tecnologías web
- Ventajas sobre Electron: más rápido, menor tamaño, mejor rendimiento
- **Vanilla JS** evita la complejidad de frameworks como React o Vue
- Ideal para una app simple de gastos sin necesidad de bundlers complejos

### Backend: Express + Bun
- **Express** es el estándar para APIs REST en Node.js
- **Bun** ejecuta JavaScript/TypeScript más rápido que Node.js
- Reduce tiempos de inicio del servidor

### Base de Datos: SQLite (bun:sqlite)
- Archivo local, no requiere instalar un servidor de base de datos
- Fácil migración a **Turso** (base de datos edge en la nube)
- Módulo nativo de Bun, sin dependencias externas

### Autenticación: JWT + bcrypt
- **bcrypt** hashea contraseñas (no se guardan en texto plano)
- **JWT (JSON Web Token)** permite autenticación sin estado (stateless)
- El token expira en 24 horas por seguridad

---

## Patrón de Arquitectura

### MVC en Express

```
Cliente (Frontend/Postman)
        |
        v
    Routes (Rutas)
        |
        v
    Controller (Lógica de negocio)
        |
        v
    Database (SQLite)
```

- **Routes:** Recibe las peticiones HTTP y las envía al controller correcto
- **Controller:** Contiene toda la lógica (validaciones, consultas, respuestas)
- **Types/Models:** Interfaces TypeScript que definen la estructura de los datos

---

## Estructura de Carpetas

```
spent/
├── .gitignore                    # Archivos/carpetas ignorados por git
├── Errores.md                    # Errores comunes y sus soluciones
├── status.md                     # Códigos de estado HTTP explicados
├── Arquitectura.md               # Este archivo
│
├── package.json                  # Dependencias del proyecto
├── tsconfig.json                 # Configuración de TypeScript
├── vite.config.ts                # Configuración de Vite
├── index.html                    # Punto de entrada del frontend
│
├── node_modules/                 # Paquetes instalados (no subir a git)
│
├── express/                      # Backend API (servidor Express)
│   ├── .gitignore                # Ignora .env y spentLocal.db
│   ├── .env                      # Variables de entorno (puerto, JWT_SECRET)
│   ├── tsconfig.json             # TypeScript para el backend
│   │
│   └── src/
│       ├── index.ts              # Punto de entrada del servidor
│       │   - Carga variables de entorno (.env)
│       │   - Inicia el servidor Express
│       │
│       ├── app.ts                # Configuración principal de Express
│       │   - Middleware para parsear JSON
│       │   - Registro de rutas
│       │
│       ├── controllers/          # Lógica de negocio
│       │   └── usuarios.controller.ts
│       │       - registrarUsuarios(): crea un nuevo usuario (hashea password)
│       │       - login(): verifica credenciales y devuelve JWT
│       │
│       ├── routes/                # Definición de rutas API
│       │   └── rutaUsuarios.ts
│       │       - POST /usuarios/register -> registrarUsuarios
│       │       - POST /usuarios/login -> login
│       │
│       ├── types/                 # Interfaces TypeScript (modelos de datos)
│       │   ├── usuarios.ts        # id, email, nombre, contrasena, fechas
│       │   ├── categorias.ts       # id, categoria, descripcion, color, tipo, idUsuario
│       │   └── gastos.ts          # id, monto, descripcion, fecha, idUsuario, idCategoria
│       │
│       └── lib/                   # Utilidades y configuración
│           ├── local/
│           │   ├── Database.ts     # Conexión singleton a SQLite
│           │   │   - obtenerInstancia(): devuelve la unica conexion
│           │   │   - Ejecuta schemas.sql automaticamente al iniciar
│           │   │
│           │   └── spentLocal.db   # Archivo de la base de datos SQLite
│           │
│           └── Schemas/
│               └── schemas.sql     # Definicion de las tablas de la DB
│                   - CREATE TABLE usuarios
│                   - CREATE TABLE categorias
│                   - CREATE TABLE gastos
│
└── src-tauri/                     # Proyecto Tauri (app de escritorio)
    ├── .gitignore
    └── ... (configuración de Tauri)
```

---

## Modelos de Datos (Tablas SQLite)

### Tabla: usuarios
| Campo              | Tipo         | Descripción                    |
|--------------------|--------------|--------------------------------|
| id                 | INTEGER      | Clave primaria, auto-incremental |
| email              | TEXT         | Email único del usuario         |
| nombre             | TEXT         | Nombre del usuario (debe empezar con @) |
| contrasena         | TEXT         | Contraseña hasheada con bcrypt   |
| fechadeCreacion    | DATETIME     | Fecha de creación (auto)        |
| fechadeActualizado | DATETIME     | Fecha de última actualización (auto) |

### Tabla: categorias
| Campo              | Tipo         | Descripción                    |
|--------------------|--------------|--------------------------------|
| id                 | INTEGER      | Clave primaria                 |
| categoria          | TEXT         | Nombre de la categoría         |
| descripcion        | TEXT         | Descripción de la categoría    |
| color              | TEXT         | Color en hexadecimal (#fff)    |
| tipo               | TEXT         | "gasto" o "ingreso"            |
| fechadeCreacion    | DATETIME     | Fecha de creación              |
| fechadeActualizado | DATETIME     | Fecha de actualización         |
| idUsuario          | INTEGER      | FK hacia usuarios              |

### Tabla: gastos
| Campo              | Tipo         | Descripción                    |
|--------------------|--------------|--------------------------------|
| id                 | INTEGER      | Clave primaria                 |
| monto              | REAL         | Cantidad del gasto (decimal)   |
| descripcion        | TEXT         | Descripción opcional           |
| fecha              | DATE         | Fecha del gasto                |
| fechadeCreacion    | DATETIME     | Fecha de creación              |
| fechadeActualizado | DATETIME     | Fecha de actualización         |
| idUsuario          | INTEGER      | FK hacia usuarios              |
| idCategoria        | INTEGER      | FK hacia categorias            |

**Relaciones:**
- usuario -> categorias: 1 a muchos
- usuario -> gastos: 1 a muchos
- categoria -> gastos: 1 a muchos
- ON DELETE CASCADE: al eliminar un usuario se eliminan sus categorías y gastos

---

## Rutas de la API (Endpoints)

### Autenticación

| Método | Ruta                  | Descripción                    | Auth |
|--------|----------------------|--------------------------------|------|
| POST   | /usuarios/register   | Registrar nuevo usuario        | No   |
| POST   | /usuarios/login      | Iniciar sesión (devuelve JWT) | No   |

### Próximas rutas (por implementar)

| Método | Ruta                    | Descripción                    | Auth |
|--------|-------------------------|--------------------------------|------|
| GET    | /categorias             | Listar categorías del usuario  | JWT  |
| POST   | /categorias             | Crear categoría                | JWT  |
| PUT    | /categorias/:id         | Actualizar categoría           | JWT  |
| DELETE | /categorias/:id         | Eliminar categoría             | JWT  |
| GET    | /gastos                | Listar gastos del usuario     | JWT  |
| POST   | /gastos                | Crear gasto                    | JWT  |
| PUT    | /gastos/:id            | Actualizar gasto               | JWT  |
| DELETE | /gastos/:id            | Eliminar gasto                 | JWT  |

---

## Flujo de Autenticación

### Registro
1. Cliente envía: email, nombre, contrasena
2. Server verifica que el email no exista
3. Server hashea la contraseña con bcrypt
4. Server inserta el usuario en la DB
5. Server devuelve: { status: "ok", id: 1 }

### Login
1. Cliente envía: email, contrasena
2. Server busca el usuario por email
3. Server compara la contraseña con el hash guardado (bcrypt.compare)
4. Si es válido, genera un JWT con id y email
5. Server devuelve: { token: "eyJhbGci..." }

### Usar el token (en requests protegidas)
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

---

## Variables de Entorno (.env)

```env
PORT=3000
JWT_SECRET=spent_dev_keySecreta_2003_rsgs
```

- **PORT:** Puerto donde corre el servidor Express
- **JWT_SECRET:** Clave secreta para firmar los tokens JWT

---

## Próximos Pasos

1. **Middleware de autenticación** - Verificar token JWT en cada request protegida
2. **Controller de categorías** - CRUD completo
3. **Controller de gastos** - CRUD completo
4. **Frontend en Tauri** - Interfaz de usuario para login, dashboard, gestión de gastos

---

## Comandos Utiles

```bash
# Iniciar servidor de desarrollo
bun run express/src/index.ts

# Probar endpoints
curl -X POST http://localhost:3000/usuarios/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","nombre":"@test","contrasena":"123456"}'

curl -X POST http://localhost:3000/usuarios/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","contrasena":"123456"}'
```
