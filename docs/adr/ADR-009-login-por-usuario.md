# ADR-009 · Acceso con nombre de usuario, no con correo

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [1.1.0](https://github.com/Juanchope039/Emprende-Documentation/commits/main/docs/adr/ADR-009-login-por-usuario.md "Historial de cambios") | [✅ Aceptado](../22-documentacion.md#estados-de-un-adr) | 2026-09-13 | 2026-09-17 | [Seguridad](../INDICE.md#etiqueta-seguridad) · [API](../INDICE.md#etiqueta-api) |

> **La decisión sigue vigente; el dominio ya está decidido.** El cuerpo hablaba de
> `@usuarios.prismamy.co` cuando el dominio era todavía una decisión pendiente de Gerencia. Es
> `@usuarios.prisma.com`, y el cuerpo ya lo dice. Se pudo cambiar sin migrar nada porque no
> existe todavía ningún usuario real: después del primero, «fijo de por vida» quiere decir
> exactamente eso.

## Contexto

El proveedor de autenticación —Supabase Auth— identifica a cada persona por un **correo
electrónico**. Quien usa este sistema es el equipo de un taller de estampados en Cali:
empleadas de producción, una domiciliaria, una asistente administrativa, una aprendiz SENA.

Varias de ellas no tienen correo, o tienen uno que no revisan y cuya contraseña no recuerdan.
Pedirle un correo a cada una para poder entrar al sistema no es un trámite menor: es la
diferencia entre que el sistema se use y que se quede en el escritorio de la Gerencia.

Lo que sí recuerdan todas es su nombre. Ese es el identificador natural aquí.

## Decisión

Se inicia sesión con **nombre de usuario y contraseña**. El correo no se pide nunca.

La aplicación traduce internamente: toma el usuario escrito, lo normaliza a minúsculas y le
pega un dominio interno fijo para armar un **correo sintético** con el que llama a
`signInWithPassword`.

```
usuario escrito:  marcela
dominio interno:  @usuarios.prisma.com     (constante de configuración, fija de por vida)
correo sintético: marcela@usuarios.prisma.com
```

- El dominio interno es un **subdominio del dominio del negocio**, no `.local`: `.local` está
  reservado por RFC 6762 para mDNS y algunas plataformas lo resuelven raro.
- El dominio **se fija una sola vez.** Cambiarlo después del primer usuario obliga a migrar
  todas las identidades.
- La **confirmación de correo queda desactivada** en el proveedor. Si alguien la activa por
  error, ningún usuario nuevo puede entrar y el mensaje de error no lo explica.
- El correo sintético es un detalle interno: **nunca se muestra, nunca se pide, nunca se
  imprime en un desprendible.**

El restablecimiento de contraseña es **presencial**: solo Gerencia genera una clave temporal
desde la pantalla de Gestión de usuarios, y el sistema obliga a cambiarla en el siguiente
ingreso.

## Justificación

**La alternativa era exigir un correo real a cada empleada, y se descartó.** Obliga a crear
cuentas de correo para personas que no las quieren, deja la puerta de entrada al sistema
colgando de un buzón que nadie revisa, y traslada el problema de la contraseña olvidada del
sistema al proveedor de correo, donde la Gerencia no puede ayudar.

El correo sintético resuelve el choque sin pelearse con el proveedor. Supabase sigue recibiendo
lo que espera —un correo— y la persona sigue escribiendo lo que sabe —su nombre—. No hay
autenticación propia, no hay hashes escritos a mano, no hay código nuevo que auditar: la
contraseña la sigue gestionando el proveedor y nunca toca código propio.

Mantener el dominio como constante y no como dato configurable en pantalla es deliberado. Un
campo editable invita a editarlo, y editarlo rompe todas las identidades ya creadas.

## Consecuencias

- **Positivas:** desaparece la barrera de adopción más grande; entrar es más rápido en celular
  porque el usuario es corto; `usuarios.usuario` es `CITEXT UNIQUE`, así que `Marcela` y
  `marcela` son la misma persona; la autenticación sigue delegada al proveedor.
- **Negativas:** **no hay «olvidé mi contraseña» por correo.** No existe un buzón al cual
  mandar un enlace, así que la recuperación es presencial y depende de que Gerencia esté
  disponible. Es una consecuencia aceptada, no un olvido: la clave temporal se entrega en
  persona y el sistema obliga a cambiarla al entrar. Además, el dominio interno queda congelado
  de por vida, y si alguien activa la confirmación de correo en el proveedor el sistema deja de
  admitir usuarios nuevos con un error que no explica la causa.

---

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [02](../02-casos-de-uso.md "02 · Casos de uso") · [04](../04-modelo-de-datos.md "04 · Modelo de datos") · [07](../07-arquitectura.md "07 · Arquitectura técnica") · [08](../08-plan-de-desarrollo.md "08 · Plan de desarrollo") · [16](../16-base-de-datos-y-snapshots.md "16 · Base de datos: snapshots y datos de prueba") · [17](../17-resiliencia-offline-y-cache.md "17 · Resiliencia, trabajo sin conexión y caché") · [19](../19-ambientes-y-entrega.md "19 · Ambientes, versionado y entrega") · [ADR-010](ADR-010-almacenamiento-contrasenas.md "ADR-010 · Almacenamiento de contraseñas: hashing delegado con salt por usuario") · [ADR-021](ADR-021-canal-firmado.md "ADR-021 · Canal firmado contra repetición y manipulación") · [ADR-033](ADR-033-service-role-solo-en-auth.md "ADR-033 · La clave de servicio entra, pero solo para crear identidades")
<!-- /generado:referenciado-desde -->
