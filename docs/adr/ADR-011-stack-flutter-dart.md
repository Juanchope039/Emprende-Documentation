# ADR-011 · Stack: Flutter y Dart con API propia

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [1.0.0](https://github.com/Juanchope039/Emprende-Documentation/commits/main/docs/adr/ADR-011-stack-flutter-dart.md "Historial de cambios") | [⛔ Reemplazado](../22-documentacion.md#estados-de-un-adr) por [ADR-017](ADR-017-api-en-java.md) | 2026-09-15 | 2026-09-16 | [Arquitectura](../INDICE.md#etiqueta-arquitectura) · [Front](../INDICE.md#etiqueta-front) · [API](../INDICE.md#etiqueta-api) |

> **Lo reemplaza [ADR-017](ADR-017-api-en-java.md):** el front sigue en Flutter, pero `prisma_api`
> pasa de Dart a Java 21 con Spring Boot, así que el argumento del lenguaje único ya no aplica.
> El cuerpo de abajo se conserva tal como se escribió.

## Contexto

[ADR-001](ADR-001-stack.md) decidió React + Vite + TypeScript + Tailwind sobre Supabase, sin
backend propio: el navegador hablaba directo con la base. Esa decisión se tomó buscando velocidad
de construcción y costo de operación cero.

Ahora se pide otra cosa. El MVP debe quedar en **dos partes, front y back**, escritas en Flutter y
Dart; todo debe pasar por peticiones a una API intermedia; y la base debe estar **siempre en
línea**, con cuatro ambientes detrás. Es un cambio de fondo: ya no se trata de qué componente
dibuja un botón, sino de dónde vive la lógica y quién puede hablar con la base.

## Alternativas consideradas

| Opción | A favor | En contra |
|---|---|---|
| **Flutter Web + API en Dart + PostgreSQL en Supabase** | Un solo lenguaje en todo el proyecto; el front deja de llevar credenciales de base; hay un sitio para las reglas que la base no puede expresar; admite un segundo cliente mañana | Devuelve el backend al proyecto, y multiplicado por cuatro ambientes |
| Mantener React + Vite + Supabase sin backend (lo de [ADR-001](ADR-001-stack.md)) | Ya estaba decidido y documentado; lo más rápido de construir; operación en $0 | Dos lenguajes; el cliente conserva la llave de la base; sin punto único donde poner reglas ni donde componer respuestas |
| Flutter con Supabase directo, sin API propia | Gana el lenguaje único en el front y evita construir el backend | No resuelve el problema real: el dispositivo sigue hablando con la base y sigue cargando credenciales. Cambia la herramienta, no la arquitectura |
| Flutter con la API en otro lenguaje (TypeScript, Python, Go) | Ecosistemas de backend más grandes y con más gente disponible | Dos lenguajes, dos cadenas de herramientas y dos formas de modelar el mismo dominio, para un equipo de una persona |

## Decisión

**`prisma_front` en Flutter Web, `prisma_api` en Dart, PostgreSQL en Supabase.**

- `prisma_front` — Flutter Web, instalable como PWA (ver [ADR-016](ADR-016-flutter-web-pwa.md)).
- `prisma_api` — Dart, que es a la vez API y BFF. Framework HTTP: **Dart Frog**, que va sobre
  Shelf y da enrutado por sistema de archivos y recarga en caliente. Si algún día conviene
  depender de menos capas, Shelf desnudo sostiene la misma estructura.
- **PostgreSQL gestionado por Supabase**, siempre en línea, un proyecto por ambiente.

> **Regla dura: el front nunca habla con Supabase directamente.** Ni con la base, ni con Auth, ni
> con Storage. Todo pasa por `prisma_api`. Si aparece el cliente de Supabase dentro del código
> Flutter, se rechaza en revisión de código.

Una sola API, y no BFF más API de dominio, porque hoy hay **un solo cliente**. Partirla daría dos
cosas que desplegar, versionar y vigilar sin ninguna ganancia. `prisma_api` queda organizada por
dentro según [ADR-002](ADR-002-arquitectura-hexagonal.md) para que ese corte sea posible el día
que exista un segundo cliente.

## Justificación

**Un solo lenguaje en todo el proyecto.** Dart en el front, Dart en la API, y las mismas reglas de
dinero y de negocio escritas una sola vez, en un solo dialecto. Para un sistema que va a mantener
una persona, cambiar de lenguaje cada vez que se cruza la frontera del navegador es el costo
oculto más caro que existe. Ese fue el factor que descartó tener la API en TypeScript o en Python,
aunque sus ecosistemas de backend sean más grandes.

**El front deja de llevar la llave.** Con la base expuesta al navegador, la credencial viaja al
dispositivo. Con la API en medio, las credenciales viven en el servidor y el front solo conoce una
URL.

**Hay dónde poner lo que la base no sabe decir.** Traducir `23514 check_violation` a un mensaje en
español, limitar intentos, revisar el tamaño de un archivo, componer una pantalla con datos de
tres tablas: nada de eso cabe bien en PostgreSQL ni debe vivir en el celular.

**[ADR-002](ADR-002-arquitectura-hexagonal.md) no se deroga: se refuerza.** Por fin hay un backend
donde aplicar la arquitectura hexagonal de verdad.

**[ADR-006](ADR-006-rls-por-rol.md) sobrevive, pero no gratis.** Con una API en medio, la base deja
de ver a la empleada y pasa a ver a la API. Si la API se conecta con la clave de servicio, RLS deja
de aplicar y todas las políticas escritas se vuelven decorado. La condición que hace defendible
este ADR está en [ADR-012](ADR-012-identidad-a-postgres.md): la identidad del usuario se propaga
hasta PostgreSQL en cada petición. Sin eso, este cambio destruye la seguridad del sistema.

## Consecuencias

- **Positivas:** un solo lenguaje de punta a punta; el front sin credenciales de base; un punto
  único para las reglas que la base no expresa y para los mensajes de error en español; la puerta
  abierta a un segundo cliente sin rehacer nada; la arquitectura hexagonal aplicada donde sí tiene
  sentido.
- **Negativas:** **el backend vuelve al proyecto.** [ADR-001](ADR-001-stack.md) justificó Supabase
  diciendo que lo más lento y riesgoso de cualquier sistema es el backend —usuarios, contraseñas,
  permisos, archivos, respaldos— y que quitarlo reducía el proyecto de unas 20 semanas a 14. Este
  cambio lo devuelve: hay que construir, probar, desplegar, versionar y asegurar `prisma_api`, y
  hacerlo **por cuatro ambientes**. El plan de 7 sprints de
  [`08-plan-de-desarrollo.md`](../08-plan-de-desarrollo.md) **ya no alcanza** y hay que rehacerlo
  con honestidad, no apretando las mismas tareas en el mismo tiempo. Se suma el costo de operación:
  «siempre en línea» saca a prod y uat del plan gratuito de Supabase, contra el presupuesto cero
  que declaró [ADR-001](ADR-001-stack.md); la factura está en [ADR-013](ADR-013-cuatro-ambientes.md). Y Flutter Web
  tiene menos gente disponible que React y un ecosistema de paquetes para web más pequeño; se
  acepta porque el lenguaje único pesa más en un equipo de una persona. A cambio se gana lo que
  está arriba, y por eso la decisión es defendible.

---

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [07](../07-arquitectura.md "07 · Arquitectura técnica") · [08](../08-plan-de-desarrollo.md "08 · Plan de desarrollo") · [ADR-001](ADR-001-stack.md "ADR-001 · Stack tecnológico") · [ADR-016](ADR-016-flutter-web-pwa.md "ADR-016 · Flutter Web instalable como PWA") · [ADR-017](ADR-017-api-en-java.md "ADR-017 · Stack: Flutter en el front, Java con Spring Boot en la API")
<!-- /generado:referenciado-desde -->
