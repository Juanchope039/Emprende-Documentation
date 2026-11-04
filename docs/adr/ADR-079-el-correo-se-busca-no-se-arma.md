# ADR-079 · El correo se busca, no se arma, y la persona decide si tiene uno

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [1.0.0](https://github.com/Juanchope039/Emprende-Documentation/commits/main/docs/adr/ADR-079-el-correo-se-busca-no-se-arma.md "Historial de cambios") | [✅ Aceptado](../22-documentacion.md#estados-de-un-adr) | 2026-11-03 | 2026-11-03 | [Seguridad](../INDICE.md#etiqueta-seguridad) · [API](../INDICE.md#etiqueta-api) |

## Contexto

El [ADR-009](ADR-009-login-por-usuario.md) arma el correo sintético pegando un dominio interno al usuario, y lo declara fijo de por
vida: si ese dominio cambia después del primer usuario, ninguna cuenta que ya existe vuelve a poder
entrar. No se pierde ningún dato, porque todo cuelga del UUID de `auth.users`, pero sí el acceso.

El proyecto todavía no tiene dominio de correo propio, y el que se usa hoy no es suyo. Además, hay
personas que sí quieren registrar un correo real, y quien dirige pidió el 2026-11-03 que el correo
sea opcional, que nazca nulo y que cada persona lo agregue o lo cambie cuando quiera.

El proveedor de autenticación no admite una cuenta con contraseña sin correo ni teléfono, y el
proveedor alojado rechaza los dominios de ejemplo y de prueba (`email_address_invalid`).

## Alternativas consideradas

- **Seguir armando el correo con un dominio configurable.** Un cambio de la variable deja a todas las
  cuentas sin poder entrar, con un error que no explica la causa.
- **Probar con el dominio nuevo y, si falla, con el anterior.** Duplica los intentos fallidos, ensucia
  la limitación de intentos y la auditoría, y obliga a convivir con dos dominios sin fecha de fin.
- **Pedir un correo obligatorio.** Lo descartó el [ADR-009](ADR-009-login-por-usuario.md), y esa razón sigue vigente.

## Decisión

1. **Se inicia sesión con el usuario, y la API busca su correo.** Lo lee en la base, del registro de
   `auth.users` que corresponde a `usuarios.usuario`, con una función `SECURITY DEFINER` que solo
   sirve para eso. Ya no lo arma con un dominio.
2. **El usuario que no existe responde igual que la clave mala**, con el mismo código y un tiempo
   parecido, para no revelar qué usuarios existen.
3. **El correo es opcional y nace nulo.** Ninguna respuesta de la API lo trae y ninguna pantalla lo
   muestra mientras la persona no ponga uno. Por dentro, `auth.users` lleva un **marcador técnico**
   que el proveedor exige: fijo en el código, sin variable de entorno, con una parte local al azar
   que no repite el usuario. Nunca se muestra, nunca recibe correo y no es un dato de la persona.
4. **La persona agrega, cambia o quita su correo cuando quiera**, desde su perfil y con su propia
   sesión. Quitarlo vuelve a poner un marcador. Gerencia no lo cambia por ella.
5. **La identidad es el UUID.** El correo, real o marcador, no es llave ni FK de nada, no entra en
   las políticas RLS y no se copia a `public.usuarios`: vive solo en `auth.users`.
6. **Mientras no haya dominio remitente, ningún correo se usa para enviar nada**: ni confirmación, ni
   recuperación. La recuperación sigue siendo presencial, como dice el [ADR-009](ADR-009-login-por-usuario.md). Si el correo real se
   confirma y sirve para recuperar la clave, lo decide un ADR nuevo cuando exista ese dominio.
7. **El dominio permitido es un parámetro opcional**, `DOMINIO_CORREO_PERMITIDO`. Nace nulo, y nulo
   quiere decir que se acepta un correo de cualquier dominio. Con un valor, la API solo lo exige al
   agregar o cambiar un correo: los que ya estaban no se tocan, así que nadie pierde el acceso por
   cambiarlo. No tiene que ver con el marcador técnico ni con el inicio de sesión.

## Justificación

Buscar el correo en vez de armarlo quita la única dependencia que ataba las cuentas a un dominio.
Con eso el marcador se puede cambiar, y la persona puede poner o quitar su correo, sin que nadie
pierda el acceso ni sus datos. Lo peor que puede pasar es que alguien tenga que volver a iniciar
sesión.

## Consecuencias

- **Positivas:** el dominio deja de importar; las cuentas que ya existen siguen entrando sin
  migrarlas; la persona decide si tiene correo y cuál.
- **Negativas:** el inicio de sesión hace una consulta más; hay una función que lee `auth.users` y
  tiene que quedar cerrada para todo lo demás; un correo agregado sin confirmar no prueba que sea de
  quien lo puso, y por eso el punto 6 prohíbe usarlo hasta el ADR que lo confirme.
- **Queda para la historia que lo implemente:** el marcador exacto, que tiene que pasar la validación
  del proveedor alojado y se prueba contra uat; si cambiar el correo con la propia sesión cierra las
  otras sesiones; el mensaje del correo repetido en el catálogo de códigos; y si el dominio permitido
  admite uno solo o una lista, que por ahora es uno solo.
- **No toca el [ADR-033](ADR-033-service-role-solo-en-auth.md):** el cambio de correo lo hace la persona con su sesión, no la clave de
  servicio.

## Referencias

- [ADR-009](ADR-009-login-por-usuario.md), al que este ADR le reemplaza «el dominio interno fijo de por vida» y «el correo no se
  pide nunca».
- HT [Juanchope039/Emprende-MiniApp-MonoRepo#77](https://github.com/Juanchope039/Emprende-MiniApp-MonoRepo/issues/77).

---

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [ADR-009](ADR-009-login-por-usuario.md "ADR-009 · Acceso con nombre de usuario, no con correo")
<!-- /generado:referenciado-desde -->
