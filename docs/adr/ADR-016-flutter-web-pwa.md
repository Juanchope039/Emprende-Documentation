# ADR-016 · Flutter Web instalable como PWA

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [1.0.0](https://github.com/Juanchope039/Emprende-Documentation/commits/main/docs/adr/ADR-016-flutter-web-pwa.md "Historial de cambios") | [✅ Aceptado](../22-documentacion.md#estados-de-un-adr) | 2026-09-15 | 2026-09-16 | [Front](../INDICE.md#etiqueta-front) |

> **Sigue vigente, y [ADR-017](ADR-017-api-en-java.md) la amplía sin contradecirla.** El front es
> Flutter **multiplataforma** y **web sigue siendo el objetivo por defecto**, que es exactamente
> lo que este ADR decidió; lo que se añade es que el mismo código compila también a Android, iOS
> y escritorio sin envolver nada. Dos referencias del cuerpo envejecieron: remite a
> [ADR-011](ADR-011-stack-flutter-dart.md), que quedó reemplazado por [ADR-017](ADR-017-api-en-java.md), y menciona Android
> como objetivo futuro cuando ya es un objetivo de compilación más. Para el stack vigente,
> [ADR-017](ADR-017-api-en-java.md).

## Contexto

[ADR-007](ADR-007-pwa.md) decidió una PWA construida con `vite-plugin-pwa`. Ese complemento
pertenece al mundo de Vite, y [ADR-011](ADR-011-stack-flutter-dart.md) cambió el front a Flutter.
La decisión de **ser una PWA** no cambia; lo que cambia es con qué se construye.

El uso sigue siendo el mismo: principalmente desde el celular, en el taller, con señal a veces
intermitente, y también desde el computador para revisar reportes. Flutter, además, abre una
puerta que antes no existía —compilar la misma base de código a Android— y hay que decidir si se
usa ahora o no.

## Alternativas consideradas

| Opción | A favor | En contra |
|---|---|---|
| **Flutter Web instalable como PWA** | Un solo desarrollo para celular y computador; sin tiendas de aplicaciones; una corrección publicada es inmediata para todos; el mismo código sirve para Android el día que haga falta | Arranca más pesado que una PWA de Vite; el primer ingreso descarga más |
| Flutter Web **más** aplicación Android | Mejor arranque e integración en el celular | Dos artefactos que versionar, firmar y publicar, con la Play Store de por medio; una corrección urgente tarda lo que tarde la revisión. Y el computador sigue necesitando la web: no ahorra un desarrollo, agrega uno |
| Solo Android nativo | La mejor experiencia en el celular | Deja por fuera el computador, que es donde Gerencia revisa reportes; obliga a publicar en tienda para cualquier corrección |

## Decisión

**`prisma_front` es una aplicación Flutter Web, instalable como PWA**, con manifiesto, ícono y
*service worker*, más la caché de la aplicación y la cola de registros para trabajar sin conexión.

**Android nativo no se construye ahora.** Queda disponible sin costo de arquitectura: la misma base
de código compila a Android el día que alguien lo pida y lo justifique.

## Justificación

El razonamiento de [ADR-007](ADR-007-pwa.md) sigue siendo válido palabra por palabra, y por eso se
conserva:

- **Un solo desarrollo cubre celular y computador.** El taller usa el teléfono; Gerencia revisa
  desde el computador. Una sola aplicación atiende a las dos.
- **Sin tiendas de aplicaciones.** No hay que publicar ni esperar aprobaciones para corregir algo.
- **Las correcciones son inmediatas.** Se publica y la siguiente apertura ya tiene la corrección.
  En un sistema que lleva la plata de un negocio, eso importa más que el arranque.
- **Las funciones nativas que se necesitan** —cámara para el recibo, almacenamiento local— están
  disponibles desde el navegador.
- **La cola sin conexión** es posible gracias a la doble fecha del modelo: el movimiento se digita
  cuando vuelve la señal, pero se contabiliza el día en que realmente ocurrió.

Lo que sí cambia, y hay que decirlo sin adornos: **Flutter Web arranca más pesado que la PWA de
Vite que decidió [ADR-007](ADR-007-pwa.md).** El motor de renderizado y las fuentes de íconos viajan al navegador en
el primer ingreso. Después la caché del *service worker* lo sostiene, pero el primer ingreso es el
que se mide.

> **[RNF-01](../03-requisitos-y-bdd.md) —la pantalla inicial carga en menos de 2 segundos con 4G—
> no se relaja por este cambio. Se mide en dispositivo real, como dice el requisito.** Si no se
> cumple, se ataca con las herramientas del propio Flutter: compilación con tree shaking de íconos,
> diferir lo que no hace falta en la primera pantalla y precargar con el *service worker*. Si aun
> así no se cumple, es la decisión la que se revisa, no el requisito.

## Consecuencias

- **Positivas:** un solo código para celular y computador; actualizaciones inmediatas sin tiendas;
  instalable en el escritorio y en la pantalla de inicio del teléfono; tolerante a fallos de red;
  y una aplicación Android disponible más adelante sin rehacer nada.
- **Negativas:** el primer ingreso es más pesado que con la PWA de Vite y queda contra el reloj de
  [RNF-01](../03-requisitos-y-bdd.md#rnf-01), así que medirlo en dispositivo real es obligatorio y no un detalle de afinación. La
  instalación en iOS sigue requiriendo el paso manual desde Safari, que se cubre en la
  capacitación. Si en el futuro la PWA resultara insuficiente, la aplicación nativa queda en el
  roadmap como idea 30.

---

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [07](../07-arquitectura.md "07 · Arquitectura técnica") · [08](../08-plan-de-desarrollo.md "08 · Plan de desarrollo") · [17](../17-resiliencia-offline-y-cache.md "17 · Resiliencia, trabajo sin conexión y caché") · [18](../18-distribucion-y-pipelines.md "18 · Distribución multiplataforma y automatización (pipelines)") · [ADR-007](ADR-007-pwa.md "ADR-007 · PWA en lugar de aplicación nativa") · [ADR-011](ADR-011-stack-flutter-dart.md "ADR-011 · Stack: Flutter y Dart con API propia") · [ADR-017](ADR-017-api-en-java.md "ADR-017 · Stack: Flutter en el front, Java con Spring Boot en la API")
<!-- /generado:referenciado-desde -->
