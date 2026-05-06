# Errores y Soluciones

## 1. Error de tipos al importar better-sqlite3
**Error:** `Could not find a declaration file for module 'better-sqlite3'`

**Causa:** Se instalo el paquete pero no sus tipos de TypeScript.

**Solución:** Instalar los tipos correspondientes.
```bash
bun add -d @types/better-sqlite3
```

---

## 2. Conflictos con el namespace Database
**Error:** `Cannot use namespace 'Database' as a type`

**Causa:** Se hacia importacion doble o se usaba `Database` como namespace en lugar de como modulo.

**Solucion:** Usar un solo import limpio.
```typescript
import Database from "better-sqlite3";
```

---

## 3. better-sqlite3 no soportado en Bun
**Error:** `'better-sqlite3' is not yet supported in Bun`

**Causa:** Bun no soporta modulos nativos de Node.js como better-sqlite3.

**Solucion:** Usar `bun:sqlite` que es el modulo nativo de Bun.
```typescript
import { Database } from "bun:sqlite";
```

---

## 4. Falta de imports de Request y Response
**Error:** `Property 'Request' does not exist on type 'typeof e'`

**Causa:** Se usaban `Request` y `Response` sin importarlos de express.

**Solucion:** Importar los tipos de express.
```typescript
import express, { Request, Response } from "express";
```

---

## 5. Orden incorrecto de parametros en funciones
**Error:** Los parametros venian invertidos, `(res, req)` en vez de `(req, res)`

**Causa:** Confusion en el orden de los parametros de Express.

**Solucion:** Siempre usar `(req, res)` - primero request, luego response.
```typescript
export const registrarUsuarios = (req: Request, res: Response) => { ... }
```

---

## 6. no coincidencias en nombres de campos
**Error:** El campo `contraseña` con ñ en el controller no coincidia con `contrasena` sin ñ en el schema y la interface.

**Causa:** Typo y falta de consistencia entre archivos.

**Solucion:** Usar siempre `contrasena` (sin ñ) en todo el proyecto.

---

## 7. no coincidencias en nombres de fechas
**Error:** `fechaCreacion` en el tipo no coincidia con `fechadeCreacion` en el schema.

**Causa:** Diferencia de formato entre archivos.

**Solucion:** Mantener los mismos nombres que en el schema SQL para evitar problemas de mapeo de datos.

---

## 8. bcrypt.compare() sin await
**Error:** `bcrypt.compare()` no funciona correctamente, siempre retorna error.

**Causa:** `bcrypt.compare()` es una funcion asincrona. Sin `await` retorna una Promise, no un boolean.

**Solucion:** Usar `await` siempre.
```typescript
const contraseñaValida = await bcrypt.compare(contrasena, hash);
```

---

## 9. Llamar funcion/obtener resultado
**Error:** El resultado de una funcion viene `undefined` o no se ejecuta la consulta.

**Causa:** Se asigna la funcion en vez de llamarla con `()`.

```typescript
// Mal
const usuario = obtenerUsuario; // asigna la funcion

// Bien
const usuario = obtenerUsuario(email); // llama la funcion y retorna el resultado
```

---

## 10. Campo opcional sin verificacion
**Error:** `Argument of type 'string | undefined' is not assignable to parameter of type 'string'`

**Causa:** Se usa un campo opcional (`?`) directamente sin verificar que existe.

**Solucion:** Verificar que el campo existe antes de usarlo.
```typescript
if (!usuario.contrasena) {
  return res.status(401).json({ error: "Credenciales incorrectas" });
}
const contraseñaValida = await bcrypt.compare(contrasena, usuario.contrasena);
```

---

## 11. dotenv.config() no encuentra el archivo .env
**Error:** `secretOrPrivateKey must have a value` o variables de entorno undefined

**Causa:** dotenv.config() no recibe la ruta del archivo .env. En Bun a veces no lo encuentra automaticamente.

**Solucion:** Especificar la ruta del archivo .env.
```typescript
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, ".env") });
```

---

## 12. Popovers de login y registro se cierran al hacer clic fuera
**Error:** Los dialogos de login y registro desaparecen cuando el usuario hace clic fuera del popover.

**Causa:** Los popovers usaban el comportamiento por defecto (`popover` sin especificar) que cierra automaticamente al hacer clic fuera.

**Solucion:** Usar `popover="manual"` para controlar manualmente cuándo se abre/cierra.
```html
<!-- Antes -->
<div id="dialogLogin" popover>

<!-- Después -->
<div id="dialogLogin" popover="manual">
```
```typescript
// Manejar el toggle manualmente con JavaScript
const dialogLogin = document.getElementById("dialogLogin") as HTMLElement;
const btnLogin = document.getElementById("btnLogin") as HTMLButtonElement;

btnLogin.addEventListener("click", () => {
  const estaAbierto = dialogLogin.matches(":popover-open");
  
  if (estaAbierto) {
    dialogLogin.hidePopover();
  } else {
    dialogLogin.showPopover();
  }
});


```
---
