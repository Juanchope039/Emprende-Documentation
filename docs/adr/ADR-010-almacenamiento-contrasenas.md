# ADR-010 · Almacenamiento de contraseñas: hashing delegado con salt por usuario

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [1.0.0](https://github.com/Juanchope039/Emprende-Documentation/commits/main/docs/adr/ADR-010-almacenamiento-contrasenas.md "Historial de cambios") | [✅ Aceptado](../22-documentacion.md#estados-de-un-adr) | 2026-09-15 | 2026-09-16 | [Seguridad](../INDICE.md#etiqueta-seguridad) |

## Contexto

Se planteó cifrar las contraseñas con una **seed propia por usuario**, de modo que dos personas
con la misma contraseña no produzcan el mismo valor almacenado —evitar colisiones— y que, al
cambiar la seed, cambie también el valor guardado.

El objetivo es correcto y es un principio real de seguridad: **dos contraseñas iguales no deben
verse iguales al almacenarse.** La pregunta que resuelve este ADR no es *si* eso debe cumplirse,
sino *quién* lo implementa.

## El hecho técnico que decide

Supabase Auth (GoTrue) ya guarda las contraseñas con **bcrypt**, y bcrypt incorpora un **salt
aleatorio único por cada contraseña**. Ese salt es, exactamente, la "seed por usuario" que pide
el requisito —solo que la genera el algoritmo, es aleatoria y se almacena dentro del propio hash.

```
Contraseña "prisma2026" de dos personas distintas:
  marcela → $2a$10$Kix2rP9...H1a   (salt Kix2rP9...)
  daniela → $2a$10$9fLm3Qz...Ubb   (salt 9fLm3Qz...)
        ↑ mismo texto, hashes completamente distintos
```

La colisión que se quería evitar **ya está evitada**. Además, el salt protege contra *rainbow
tables* (tablas precalculadas de hashes), que es la otra razón por la que existe.

Sobre "al cambiar la seed cambia el hash": con bcrypt eso ocurre de forma natural cada vez que la
persona **cambia su contraseña** —se genera un salt nuevo—. Cambiar el salt *sin* cambiar la
contraseña no aporta seguridad y, de hecho, no se puede hacer sin conocer la contraseña en claro,
que el sistema nunca guarda ([RNF-18](../03-requisitos-y-bdd.md#rnf-18), ver [`04-modelo-de-datos.md`](../04-modelo-de-datos.md) [§5.4](../04-modelo-de-datos.md#54-auditoría-por-triggers)).

## Alternativas consideradas

| Opción | A favor | En contra |
|---|---|---|
| **Delegar a Supabase Auth (bcrypt + salt por usuario)** | Estándar probado; salt por usuario incluido; cero código criptográfico propio; coherente con [ADR-009](ADR-009-login-por-usuario.md) | El hash vive en `auth.users`, gestionado por el proveedor |
| Añadir un *pepper* del servidor | Un secreto global adicional endurece frente a filtración de la base | Más complejidad operativa; el proveedor no expone ese punto de extensión de forma trivial |
| Cifrado/hashing propio con seed | Control total | **Rodar tu propia criptografía**: anti-patrón de seguridad; contradice [ADR-009](ADR-009-login-por-usuario.md); reintroduce hashes en código propio |

## Decisión

**Se mantiene la autenticación delegada a Supabase Auth.** Las contraseñas se siguen almacenando
con bcrypt y su salt por usuario. **No se implementa criptografía de contraseñas propia.**

El objetivo del requisito —que contraseñas iguales no colisionen— **queda cumplido** por el salt
por usuario que bcrypt ya aplica.

## Justificación

- **No se rueda criptografía propia.** Es la regla de oro de la seguridad de contraseñas: los
  errores sutiles (salt reutilizado, algoritmo rápido, comparación no constante) son invisibles
  hasta que alguien los explota.
- **Coherencia con [ADR-009](ADR-009-login-por-usuario.md) y [ADR-001](ADR-001-stack.md):** la
  autenticación está delegada al proveedor; "la contraseña la gestiona el proveedor y nunca toca
  código propio".
- **bcrypt tiene factor de trabajo** ajustable: hace el hashing deliberadamente lento para
  frenar la fuerza bruta, algo que un cifrado casero no contempla.

## Consecuencias

- **Positivas:** seguridad estándar y auditada; cero superficie de ataque criptográfico propio;
  el requisito de anti-colisión se cumple sin escribir una línea de cripto.
- **Límites:** el hash vive en `auth.users`, fuera del esquema propio. Si en el futuro se quisiera
  un **pepper** del lado servidor (por ejemplo, en un *Edge Function* de Supabase antes de delegar
  a Auth), queda como decisión futura y se registraría en un ADR nuevo. No se adopta ahora porque
  su beneficio marginal no compensa la complejidad para un sistema de esta escala.

> **Resumen para no técnicos.** Pediste que dos contraseñas iguales no se guarden iguales. El
> sistema ya lo hace: cada contraseña se guarda revuelta con un "grano de sal" distinto y
> aleatorio, así que aunque dos personas usen la misma clave, lo que queda guardado es distinto.
> No hace falta construir nada nuevo; construirlo a mano sería, además, más riesgoso.

## Referencias

- [ADR-009 · Acceso con nombre de usuario, no con correo](ADR-009-login-por-usuario.md)
- [ADR-001 · Stack tecnológico](ADR-001-stack.md)
- [`11-riesgos-y-proteccion-de-datos.md`](../11-riesgos-y-proteccion-de-datos.md)

---

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [04](../04-modelo-de-datos.md "04 · Modelo de datos") · [07](../07-arquitectura.md "07 · Arquitectura técnica")
<!-- /generado:referenciado-desde -->
