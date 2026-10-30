# 18 · Distribución multiplataforma y automatización (pipelines)

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [0.1.1](https://github.com/Juanchope039/Emprende-Documentation/commits/main/docs/18-distribucion-y-pipelines.md "Historial de cambios") | [💡 Propuesta](22-documentacion.md#estados) | 2026-09-15 | 2026-10-30 | [Entrega](INDICE.md#etiqueta-entrega) · [Front](INDICE.md#etiqueta-front) |

> **Todavía es una idea, no una decisión.** Este documento recoge la intención de distribuir la aplicación
> en **web, Android, iPhone y escritorio Windows**, y de automatizar pruebas y publicación.
> Con Flutter multiplataforma no hay nada que empaquetar: el mismo código compila a cada
> objetivo. Lo que **queda por decidir** es **qué objetivos se publican y cuándo** ([§5](#5-qué-objetivos-de-compilación-se-publican-y-cuándo)), con sus
> costos a la vista. Hoy la decisión vigente sigue siendo la PWA
> ([ADR-016](adr/ADR-016-flutter-web-pwa.md)); las apps de tienda amplían la **idea 30** del
> [roadmap](14-roadmap-e-ideas.md).

---

## 1. Qué se quiere

| Objetivo | Detalle |
|---|---|
| Pipeline de **pruebas** | Que cada cambio se valide solo: formato, tipos, pruebas y build |
| Pipeline de **descarga de versiones** | Generar los instalables de cada plataforma de forma automática |
| Plataformas | **Web**, **Android**, **iPhone (iOS)**, **escritorio Windows** |

---

## 2. Punto de partida

Hoy el producto es una **PWA** construida con Flutter (un solo código que se instala desde el
navegador, [ADR-016](adr/ADR-016-flutter-web-pwa.md)). Eso ya cubre «web» y da una instalación
básica en Android, iOS y Windows **sin** tiendas de aplicaciones.

El mismo código fuente compila además a Android, iOS y escritorio sin envolver nada ni reescribir
pantallas. Eso abarata el **salto técnico**, pero no el salto de alcance: publicar en una tienda
sigue costando cuentas, revisiones y mantenimiento permanente ([§5.2](#52-cuándo-se-agrega-un-objetivo) y [§6](#6-realidades-de-publicar-costos-que-hay-que-nombrar)). Por eso los objetivos
nativos se documentan aquí como idea, no como compromiso.

---

## 3. Integración continua — el pipeline de pruebas

Sobre GitHub Actions (el repositorio ya vive en GitHub). Se dispara en cada *push* y *pull
request*. Son **dos proyectos con herramientas distintas** —el front es Flutter y la API es
Java—, así que el pipeline los corre como dos trabajos en paralelo, no como uno solo.

| Etapa | Front (`emprende_front`, Flutter) | API (`prisma_api`, Java) | Bloquea la fusión si… |
|---|---|---|---|
| Instalar | `flutter pub get` con caché | Dependencias de la herramienta de construcción, con caché | — |
| Formato | `dart format --set-exit-if-changed` | Formateador del proyecto en modo verificación | El código no está formateado |
| Análisis estático | `flutter analyze --fatal-infos` | Compilación con los avisos tratados como error | Hay un aviso sin resolver |
| Pruebas unitarias | `flutter test` | Pruebas del dominio financiero, sin base ni red ([`12-pruebas-y-calidad.md`](12-pruebas-y-calidad.md)) | Falla una prueba |
| Contrato de la API | — | Regenera el OpenAPI y lo compara con el versionado en el repositorio | El documento versionado quedó desactualizado |
| Compilación | `flutter build web` | Empaquetado del artefacto ejecutable de la API | No compila |

Este pipeline **se puede crear en cuanto existan los dos proyectos** —el `pubspec.yaml` del front
y el descriptor de construcción de la API—, incluso antes de compilar para ninguna tienda. Es la
primera automatización recomendada. Cuál herramienta de construcción use la API ya está
decidida: es **Gradle**, como fija [ADR-024](adr/ADR-024-java-25-y-gradle.md), porque descarga
el JDK por su cuenta y quien clone el proyecto compila sin instalar nada. Las etapas de arriba
no dependen de esa elección.

> **La versión definitiva de este pipeline vive en
> [`19-ambientes-y-entrega.md`](19-ambientes-y-entrega.md) [§6](19-ambientes-y-entrega.md#6-integración-continua).** Allí está lo que aquí no cabe:
> lo que corre en cada empuje, lo que corre en cada promoción contra una base real y las dos
> pruebas que no se pueden saltar. Esta tabla es el resumen; si las dos discrepan, manda el 19.

---

## 4. Entrega continua — el pipeline de descargas por plataforma

| Objetivo | Artefacto | Cómo se genera (previsto) | Publicación |
|---|---|---|---|
| **Web / PWA** | Sitio desplegado | `flutter build web` y promoción del artefacto ([`19-ambientes-y-entrega.md`](19-ambientes-y-entrega.md) [§2.3](19-ambientes-y-entrega.md#23-el-artefacto-se-promueve-no-se-reconstruye)) | Por promoción, no por *push* |
| **Android** | `.aab` (y `.apk` para pruebas) | `flutter build appbundle` | Google Play (cuenta de desarrollador) |
| **iPhone (iOS)** | `.ipa` | `flutter build ipa`, **solo en un Mac** | App Store (cuenta Apple Developer) |
| **Windows** | `.exe` / `.msi` | `flutter build windows` más el armado del instalador | Descarga directa + firma de código |
| **API** (`prisma_api`) | Ejecutable de Java o imagen de contenedor | Empaquetado del proyecto Java | **No se descarga**: se despliega por promoción de ambiente ([`19-ambientes-y-entrega.md`](19-ambientes-y-entrega.md)) |

La API va en esta tabla aunque nadie la descargue: el mismo pipeline tiene que producir su
artefacto y promoverlo por los ambientes. Su número de versión es **independiente** del front
([ADR-014](adr/ADR-014-semver.md)); lo que comparten es el recorrido, no la numeración.

---

## 5. Qué objetivos de compilación se publican, y cuándo

Con Flutter, la pregunta **cambió**. Ya no es «con qué envolvemos la web para que corra como app»
—no hay que envolver nada—, sino «cuál de los objetivos que el mismo código ya compila se
publica, cuándo y a cambio de qué». La decisión dejó de ser técnica y pasó a ser de alcance.

### 5.1 Los objetivos disponibles

| Objetivo | Comando | Estado hoy | Qué habría que pagar para publicarlo |
|---|---|---|---|
| **Web (PWA)** | `flutter build web` | **Publicado.** Es el objetivo por defecto ([ADR-016](adr/ADR-016-flutter-web-pwa.md)) | Nada nuevo |
| **Android** | `flutter build appbundle` | Disponible sin código extra; no se publica | Cuenta de Play, firma y revisión de tienda |
| **iOS** | `flutter build ipa` | Disponible, pero solo se compila en un Mac; no se publica | Cuenta Apple anual, un Mac y revisión |
| **Escritorio Windows** | `flutter build windows` | Disponible sin código extra; no se publica | Certificado de firma de código anual |

Los cuatro salen del **mismo código**, sin capas intermedias ni pantallas duplicadas. Lo que
diferencia a uno de otro ya no es el esfuerzo de programación, sino lo del [§6](#6-realidades-de-publicar-costos-que-hay-que-nombrar): cuentas, firmas,
revisiones y máquinas.

### 5.2 Cuándo se agrega un objetivo

Un objetivo nativo entra cuando **la PWA se queda corta para algo concreto del taller**, no
porque quede bien estar en una tienda. Disparadores que sí lo justificarían:

| Disparador | Objetivo que lo resuelve |
|---|---|
| Hace falta escanear con la cámara de forma confiable | Android, iOS |
| Hacen falta avisos que lleguen con el celular bloqueado, sobre todo en iPhone | iOS |
| Hace falta imprimir en una impresora del taller conectada al equipo | Windows |
| La empleada necesita abrir la app sin pasar por el navegador | Android, Windows |

> **Cada objetivo publicado se mantiene para siempre.** Una tienda agrega revisiones antes de
> cada publicación, versiones mínimas de sistema operativo y usuarios que se quedan en versiones
> viejas. Con un equipo pequeño, sumar un objetivo es sumar trabajo permanente, no una casilla
> más en el pipeline.

Cuando se decida publicar alguno, se registra en un ADR propio con el disparador que lo motivó.
Hoy no se decide ninguno.

### 5.3 Registro: la comparación que dejó de aplicar

Hasta el cambio de stack, esta sección comparaba **Capacitor**, **Tauri** y **Electron**. Las
tres son formas de **envolver una aplicación web** en un contenedor nativo. Se deja el registro
porque la decisión de no usarlas tiene que poder rastrearse:

| Tecnología | Qué cubría | Por qué ya no aplica |
|---|---|---|
| **Capacitor** | Android + iOS | Flutter compila nativo a ambos: no hay una web que envolver |
| **Tauri** | Windows (y más) | Igual en escritorio, y sin meter Rust en el pipeline |
| **Electron** | Windows (y más) | Igual, y sin el instalable pesado que era su mayor costo |

La comparación no estaba equivocada: estaba resuelta **para otro stack**. Con Flutter
multiplataforma desaparecieron a la vez sus costos (una cadena de herramientas extra por
plataforma) y su ventaja (reusar la web tal cual). Lo que queda es [§5.1](#51-los-objetivos-disponibles): elegir objetivos, no
envoltorios.

---

## 6. Realidades de publicar (costos que hay que nombrar)

| Plataforma | Costo / requisito real |
|---|---|
| Google Play | Cuenta de desarrollador (pago único) + revisión |
| App Store | Cuenta Apple Developer (**pago anual**) + revisión + un Mac para compilar |
| Windows | **Firma de código** (certificado anual) para que no salte la alerta de "editor desconocido" |
| Secretos en CI | Claves de firma y tokens de tienda guardados como *secrets* del repositorio, nunca en el código |

Estos costos son la razón por la que la PWA fue la decisión inicial: **cero tiendas, cero cuotas,
actualización inmediata**. Un objetivo nativo se justifica solo si aparece una necesidad que la
PWA no cubra ([§5.2](#52-cuándo-se-agrega-un-objetivo)); el costo de compilarlo es cero, el de publicarlo no.

---

## 7. Matriz resumen

| | Pipeline de pruebas | Pipeline de descarga | Depende de |
|---|:---:|:---:|---|
| Web / PWA | ✅ | ✅ (promoción) | `pubspec.yaml` del front |
| Android | ✅ | ⬜ | Decidir el objetivo ([§5.2](#52-cuándo-se-agrega-un-objetivo)) + cuenta Play + firma |
| iOS | ✅ | ⬜ | Decidir el objetivo ([§5.2](#52-cuándo-se-agrega-un-objetivo)) + cuenta Apple + Mac |
| Windows | ✅ | ⬜ | Decidir el objetivo ([§5.2](#52-cuándo-se-agrega-un-objetivo)) + certificado de firma |
| API (`prisma_api`) | ✅ | ➖ (se promueve, no se descarga) | Proyecto Java andamiado |

---

## 8. Estado y siguiente paso

- **Decidido hoy:** nada nuevo. La PWA sigue vigente y web sigue siendo el objetivo por defecto
  ([ADR-016](adr/ADR-016-flutter-web-pwa.md)).
- **Resuelto:** ya no hay que elegir tecnología de empaquetado. Flutter compila nativo y la
  comparación de envoltorios quedó registrada como histórica en [§5.3](#53-registro-la-comparación-que-dejó-de-aplicar).
- **Primer paso barato cuando existan los dos proyectos:** el pipeline de pruebas del [§3](#3-integración-continua--el-pipeline-de-pruebas), con sus
  dos trabajos, el de Flutter y el de Java.
- **Pendiente de decisión:** qué objetivos nativos se publican y cuándo ([§5.2](#52-cuándo-se-agrega-un-objetivo)), que se registrará
  en un ADR propio, y la apertura de cuentas de tienda del [§6](#6-realidades-de-publicar-costos-que-hay-que-nombrar).

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [19](19-ambientes-y-entrega.md "19 · Ambientes, versionado y entrega")
<!-- /generado:referenciado-desde -->

---

### 🧭 Navegación

**⬅️ Anterior:** [17 · Resiliencia, trabajo sin conexión y caché](17-resiliencia-offline-y-cache.md)  ·  **🗂️ [Índice general](INDICE.md)**  ·  **Siguiente ➡️:** [19 · Ambientes, versionado y entrega](19-ambientes-y-entrega.md)
