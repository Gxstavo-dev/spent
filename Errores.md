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
