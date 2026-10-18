# ADR-007 · PWA en lugar de aplicación nativa

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [1.0.0](https://github.com/Juanchope039/Emprende-Documentation/commits/main/docs/adr/ADR-007-pwa.md "Historial de cambios") | [⛔ Reemplazado](../22-documentacion.md#estados-de-un-adr) por [ADR-016](ADR-016-flutter-web-pwa.md) | 2026-09-13 | 2026-09-16 | [Front](../INDICE.md#etiqueta-front) |

> **Lo reemplaza [ADR-016](ADR-016-flutter-web-pwa.md):** sigue siendo una PWA, pero construida
> con Flutter Web y no con `vite-plugin-pwa`, que ya no aplica sin Vite. El cuerpo de abajo
> se conserva tal como se escribió.

## Contexto

El uso principal es desde el celular, en el taller, con señal a veces intermitente. También debe
usarse desde el computador para revisar reportes.

## Alternativas consideradas

| Opción | A favor | En contra |
|---|---|---|
| **PWA** | Un solo código para celular y PC; instalable; sin tiendas de aplicaciones | Menos acceso a funciones del teléfono |
| App nativa | Mejor integración con el dispositivo | Dos desarrollos, publicación en tiendas, actualizaciones lentas |
| Solo web | Lo más simple | No se instala, no funciona sin señal |

## Decisión

**PWA** con `vite-plugin-pwa`: instalable en el celular, con caché de la aplicación y cola de
registros para trabajar sin conexión.

## Justificación

Un solo desarrollo cubre los dos dispositivos. No hay que publicar en tiendas ni esperar
aprobaciones para corregir algo. Las funciones nativas que se necesitan —cámara para el recibo,
almacenamiento local— están disponibles desde el navegador.

La cola sin conexión es posible gracias a la doble fecha del modelo: el movimiento se digita
cuando vuelve la señal, pero se contabiliza el día en que realmente ocurrió.

## Consecuencias

- **Positivas:** un solo código; actualizaciones inmediatas; instalable; tolerante a fallos de
  red.
- **Negativas:** la instalación en iOS requiere un paso manual desde Safari, que se cubre en la
  capacitación. Si en el futuro la PWA resultara insuficiente, la app nativa queda en el roadmap
  como idea 30.

---

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [07](../07-arquitectura.md "07 · Arquitectura técnica") · [17](../17-resiliencia-offline-y-cache.md "17 · Resiliencia, trabajo sin conexión y caché") · [ADR-016](ADR-016-flutter-web-pwa.md "ADR-016 · Flutter Web instalable como PWA")
<!-- /generado:referenciado-desde -->
