// Configuración de la documentación de Emprende.
//
// Qué documentos se cubren, qué estados y etiquetas existen y dónde se define cada familia de
// identificadores. Las reglas que esto sostiene están escritas en docs/22-documentacion.md: si
// cambia algo aquí, cambia allá en el mismo commit.

export const GITHUB = 'https://github.com/Juanchope039';

export const ESPECIFICACION = {
  nombre: 'Emprende-Documentation',
  github: `${GITHUB}/Emprende-Documentation`,
  rama: 'main',
};

// Los repositorios de código son hermanos de esta especificación en la carpeta de trabajo (ADR-035):
// las rutas van desde la raíz de este repositorio. Si no están en disco —como en la CI de este
// repositorio— simplemente no se revisan.
export const REPOS_DE_CODIGO = [
  {
    carpeta: '../backend-api',
    nombre: 'emprende_api',
    github: `${GITHUB}/Emprende-API`,
    version: { archivo: 'build.gradle.kts', patron: /^version = "([^"]+)"/m },
  },
  {
    carpeta: '../backend-db',
    nombre: 'emprende_db',
    github: `${GITHUB}/Emprende-DataBase`,
    version: null,
  },
  {
    carpeta: '../frontend-flutter',
    nombre: 'emprende_front',
    github: `${GITHUB}/Emprende-Front`,
    version: { archivo: 'pubspec.yaml', patron: /^version: ([0-9][^+\s]*)/m },
  },
];

// Documentos de la especificación que muestran además la versión de otra cosa. La verificación
// comprueba que el número del encabezado sea el del archivo.
export const VERSIONES_EXTRA = {
  'contrato/README.md': {
    columna: 'Contrato',
    archivo: 'contrato/openapi.json',
    leer: (texto) => JSON.parse(texto).info.version,
  },
};

// Archivos Markdown que no son documentación del proyecto: plantillas de terceros.
export const EXCLUIDOS = new Set([
  '../frontend-flutter/ios/Runner/Assets.xcassets/LaunchImage.imageset/README.md',
]);

// Carpetas cuyo Markdown no es documentación del proyecto y no se versiona con ADR-027: `.claude` y
// `.agents` traen habilidades y configuración de agentes. Las que instala alguien no las escribe el
// proyecto, y las que sí escribe son instrucciones para un agente, no documentos.
export const CARPETAS_EXCLUIDAS = ['.claude', '.agents'];

export const ZONA_HORARIA = 'America/Bogota';

// Documento donde viven las reglas: los enlaces de estado y etiqueta apuntan aquí.
export const DOC_REGLAS = 'docs/22-documentacion.md';
export const DOC_INDICE = 'docs/INDICE.md';
export const DOC_PLAN = 'docs/08-plan-de-desarrollo.md';
export const DOC_TAREAS = 'TODO.md';

// «cero»: la versión tiene que ser 0.y.z. «estable»: 1.0.0 o más. «cualquiera»: sin regla.
export const ESTADOS = {
  documento: {
    'Borrador': { icono: '📝', versiones: 'cero' },
    'Propuesta': { icono: '💡', versiones: 'cero' },
    'En revisión': { icono: '🔍', versiones: 'cero' },
    'Vigente': { icono: '✅', versiones: 'estable' },
    'Vivo': { icono: '🔄', versiones: 'estable' },
    'Reemplazado': { icono: '⛔', versiones: 'cualquiera' },
  },
  adr: {
    'Propuesto': { icono: '📝', versiones: 'cero' },
    'Aceptado': { icono: '✅', versiones: 'estable' },
    'Rechazado': { icono: '❌', versiones: 'cualquiera' },
    'Reemplazado': { icono: '⛔', versiones: 'cualquiera' },
  },
};

export const ETIQUETAS = {
  'negocio': 'Negocio',
  'finanzas': 'Finanzas',
  'nomina': 'Nómina',
  'requisitos': 'Requisitos',
  'ux': 'UX',
  'arquitectura': 'Arquitectura',
  'api': 'API',
  'front': 'Front',
  'base-de-datos': 'Base de datos',
  'seguridad': 'Seguridad',
  'datos-personales': 'Datos personales',
  'calidad': 'Calidad',
  'entrega': 'Entrega',
  'plan': 'Plan',
  'paralelo': 'Paralelo',
  'contrato': 'Contrato',
  'proceso': 'Proceso',
};

// Dónde se define cada familia de identificadores. El ancla es el identificador en minúsculas
// (RF-01 → #rf-01). Si la familia tiene sección propia para algunos casos —como CU-01—, el ancla
// va en ese encabezado y la fila de la tabla enlaza a él.
export const FAMILIAS = [
  { familia: 'BDD', documento: 'docs/03-requisitos-y-bdd.md' },
  { familia: 'RNF', documento: 'docs/03-requisitos-y-bdd.md' },
  { familia: 'RF', documento: 'docs/03-requisitos-y-bdd.md' },
  { familia: 'RN', documento: 'docs/03-requisitos-y-bdd.md' },
  { familia: 'CU', documento: 'docs/02-casos-de-uso.md' },
  { familia: 'R', documento: 'docs/11-riesgos-y-proteccion-de-datos.md' },
  { familia: 'RE', documento: 'docs/12-pruebas-y-calidad.md' },
  { familia: 'P', documento: 'docs/12-pruebas-y-calidad.md' },
  { familia: 'A', documento: 'docs/12-pruebas-y-calidad.md' },
  { familia: 'M', documento: 'docs/12-pruebas-y-calidad.md' },
  { familia: 'I', documento: 'docs/12-pruebas-y-calidad.md' },
  { familia: 'F', documento: 'docs/12-pruebas-y-calidad.md' },
  { familia: 'T', documento: 'docs/12-pruebas-y-calidad.md' },
  { familia: 'C', documento: 'docs/12-pruebas-y-calidad.md' },
  { familia: 'D', documento: 'docs/14-roadmap-e-ideas.md' },
  { familia: 'S', documento: 'docs/01-vision-y-alcance.md' },
  { familia: 'H', documento: 'docs/08-plan-de-desarrollo.md' },
];

// Los documentos que solo son índices no cuentan en «Referenciado desde»: enlazan a todo.
export const NO_CUENTAN_COMO_REFERENCIA = new Set([
  'README.md',
  'TODO.md',
  'docs/INDICE.md',
  'docs/adr/README.md',
]);

// La deuda declarada de ADR-043: las dependencias que apuntan a una tarea POSTERIOR. La regla es que
// una tarea solo depende de tareas anteriores, y `verificar` falla con cualquier par que no esté
// aquí. También falla si un par de aquí ya no existe en el plan, así que la lista solo se encoge:
// cuando quede vacía, se borra y la regla se queda sin excepciones.
//
// Cada par es [la tarea, la tarea posterior de la que depende]. El motivo es el del grupo, y se
// escribe una vez: lo que lo explica es por qué la tarea posterior nació después.
export const DEPENDENCIAS_HACIA_ADELANTE = [
  // Las tres que cruzan de sprint, que son el caso grave de ADR-043 §2: lo que está mal es el número
  // del sprint, y cambiarlo lo decide quien dirige. Siguen declaradas porque nadie lo ha decidido.
  { de: '4.3', a: '5.2', motivo: 'Productos va antes que Pedidos: el pedido con lineas necesita el catalogo (08 §7)' },
  { de: '6.1', a: '7.3', motivo: 'Reportes y Capital se entrelazan: el flujo de caja necesita el pro-labore (05 §12.2)' },
  { de: '6.1', a: '7.4', motivo: 'Reportes y Capital se entrelazan: el flujo de caja necesita el retiro (05 §12.2)' },
  // El sobre de respuesta se escribio despues de la consulta de version, que lo usa.
  { de: '0.11', a: '0.14', motivo: 'el sobre es un cimiento y entro al Sprint 0 despues de la consulta que lo usa' },
  // La decision del esquema para las pruebas de integracion, que ADR-025 dejo abierta (08 §0.2).
  { de: '1.7', a: '1.20', motivo: 'la decision del esquema de emprende_db se numero al final del Sprint 1 (08 §0.2)' },
  { de: '1.8', a: '1.20', motivo: 'la decision del esquema de emprende_db se numero al final del Sprint 1 (08 §0.2)' },
  { de: '1.15', a: '1.20', motivo: 'la decision del esquema de emprende_db se numero al final del Sprint 1 (08 §0.2)' },
  // Las doce tareas que el plan hacia sin numerarlas (08 §0.2): el contrato por funcionalidad, el
  // renderizador del descriptor y el cliente HTTP nacieron despues de lo que los necesita.
  { de: '1.10', a: '1.14', motivo: 'el filtro de idempotencia se numero despues de la gestion que lo usa' },
  { de: '1.10', a: '1.17', motivo: 'el contrato por funcionalidad se numero al final del sprint (08 §0.2)' },
  { de: '1.10', a: '1.18', motivo: 'la mitad de front de RF-102 se numero al final del sprint (08 §0.2)' },
  { de: '1.10', a: '1.19', motivo: 'la mitad de front de ADR-020 se numero al final del sprint (08 §0.2)' },
  { de: '2.1', a: '2.19', motivo: 'el contrato por funcionalidad se numero al final del sprint (08 §0.2)' },
  { de: '2.6', a: '2.19', motivo: 'el contrato por funcionalidad se numero al final del sprint (08 §0.2)' },
  { de: '3.4', a: '3.13', motivo: 'el contrato por funcionalidad se numero al final del sprint (08 §0.2)' },
  { de: '3.5', a: '3.13', motivo: 'el contrato por funcionalidad se numero al final del sprint (08 §0.2)' },
  { de: '4.2', a: '4.10', motivo: 'el contrato por funcionalidad se numero al final del sprint (08 §0.2)' },
  { de: '5.2', a: '5.10', motivo: 'el contrato por funcionalidad se numero al final del sprint (08 §0.2)' },
  { de: '5.9', a: '5.10', motivo: 'el contrato por funcionalidad se numero al final del sprint (08 §0.2)' },
  { de: '6.3', a: '6.10', motivo: 'el contrato por funcionalidad se numero al final del sprint (08 §0.2)' },
  { de: '6.5', a: '6.10', motivo: 'el contrato por funcionalidad se numero al final del sprint (08 §0.2)' },
  { de: '7.1', a: '7.9', motivo: 'el contrato por funcionalidad se numero al final del sprint (08 §0.2)' },
  { de: '7.2', a: '7.9', motivo: 'el contrato por funcionalidad se numero al final del sprint (08 §0.2)' },
  { de: '7.3', a: '7.9', motivo: 'el contrato por funcionalidad se numero al final del sprint (08 §0.2)' },
  { de: '7.7', a: '7.9', motivo: 'el contrato por funcionalidad se numero al final del sprint (08 §0.2)' },
  { de: '8.1', a: '8.11', motivo: 'el contrato por funcionalidad se numero al final del sprint (08 §0.2)' },
  { de: '8.5', a: '8.11', motivo: 'el contrato por funcionalidad se numero al final del sprint (08 §0.2)' },
  { de: '8.8', a: '8.11', motivo: 'el contrato por funcionalidad se numero al final del sprint (08 §0.2)' },
  { de: '8.9', a: '8.11', motivo: 'el contrato por funcionalidad se numero al final del sprint (08 §0.2)' },
  { de: '8.10', a: '8.11', motivo: 'el contrato por funcionalidad se numero al final del sprint (08 §0.2)' },
  // La mitad de base que una tarea de API o de Front daba por hecha, y que aparecio al hacerla.
  { de: '2.1', a: '2.4', motivo: 'la tabla usuarios se amplio despues de la sesion que la consulta' },
  { de: '2.8', a: '2.22', motivo: 'las dos reglas de cargos aparecieron al hacer el catalogo (08 Sprint 2)' },
  { de: '2.9', a: '2.21', motivo: 'la auditoria de usuarios aparecio al hacer el registro de ingresos' },
  { de: '2.13', a: '2.20', motivo: 'las tablas del canal firmado aparecieron al ir a hacer el filtro (08 Sprint 2)' },
  { de: '2.15', a: '2.21', motivo: 'la auditoria de usuarios aparecio despues de la tabla que la usa' },
  { de: '2.16', a: '2.21', motivo: 'la auditoria de usuarios aparecio despues de la bitacora que la usa' },
  { de: '3.6', a: '3.14', motivo: 'la tabla adjuntos no existia y ninguna tarea la creaba (08 Sprint 3)' },
  { de: '4.9', a: '4.11', motivo: 'las columnas de la cancelacion aparecieron al hacer la cancelacion' },
  { de: '5.2', a: '5.11', motivo: 'el RLS de productos aparecio al hacer el catalogo (08 Sprint 5)' },
  { de: '8.8', a: '8.12', motivo: 'las tablas del cotizador aparecieron al acordar su contrato' },
  // Lo que el dibujo del libro le sumo al Sprint 3, que el 08 explica al pie de su tabla.
  { de: '3.8', a: '3.21', motivo: 'el libro en la API entro con el dibujo del mockup (08 Sprint 3)' },
  { de: '3.9', a: '3.23', motivo: 'la anulacion que arrastra entro con el dibujo del mockup (08 Sprint 3)' },
  // Lo demas, uno a uno.
  { de: '2.2', a: '2.14', motivo: 'la navegacion dictada por la API se numero despues del enrutamiento' },
  { de: '3.6', a: '3.16', motivo: 'el andamio del celular entro al sprint despues de la foto del recibo' },
  { de: '8.2', a: '8.3', motivo: 'la liquidacion en la base se numero antes de los adelantos que descuenta' },
  { de: '9.10', a: '9.11', motivo: 'etiquetar 1.0.0 espera a todo el sprint, Swagger en prod incluido' },
];

// El calendario del plan. Una sola tarea a la vez avanza al ritmo del plan original: 151,5 días de trabajo en 23
// semanas de desarrollo. La estabilización no se parte: son 3 semanas con cualquier número de
// tareas a la vez (21-trabajo-en-paralelo.md §5).
export const RITMO_DIAS_POR_SEMANA = 151.5 / 23;
// Cada tarea a la vez de más le quita un 10 % de ritmo a todos: revisiones cruzadas, acuerdos de
// contrato e integración. Con 2 a la vez el calendario da ≈17,7 semanas, lo mismo que 21 §5
// estimaba a ojo antes de que existiera este cálculo.
export const COSTO_DE_COORDINACION_POR_TAREA = 0.1;
// Fecha en que arrancó el desarrollo; solo sirve para dibujar el diagrama de Gantt.
export const INICIO_DEL_PLAN = '2026-09-15';
export const SEMANAS_DE_ESTABILIZACION = 3;
export const TAREAS_A_LA_VEZ_A_SIMULAR = [1, 2, 3];
export const DONDE_VIVE_LA_TAREA = ['API', 'Base', 'Front', 'Contrato', 'Decisión'];

// Los sprints cerrados, con el número de tareas con que se cerró cada uno (ADR-068). A un sprint
// cerrado no se le agregan tareas: lo que haga falta entra en un sprint nuevo. `verificar` compara
// esta tabla con las del plan, así que agregar una fila a un sprint cerrado pone el PR en rojo.
// Abrir un sprint nuevo lo autoriza quien dirige, y entonces el anterior se cierra con su cuenta.
export const SPRINTS_CERRADOS = { 0: 19, 1: 21, 2: 22, 3: 25, 4: 11, 5: 11, 6: 11, 7: 10, 8: 19, 9: 17, 10: 8 };
