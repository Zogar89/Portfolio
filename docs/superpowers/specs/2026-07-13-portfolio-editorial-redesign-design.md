# Rediseño editorial del portfolio

## Objetivo

Transformar el portfolio actual en una presentación editorial distintiva para recruiters y personas de producto. El sitio debe posicionar a Gabriel como un perfil híbrido, capaz de detectar una fricción, tomar decisiones de producto y construir el sistema técnico que las sostiene.

El resultado no debe parecer una galería de dashboards ni una lista de tecnologías. Cada proyecto debe funcionar como evidencia de una forma de pensar y ejecutar.

## Audiencia y criterio de éxito

La audiencia principal combina:

- recruiters que necesitan entender el perfil en pocos segundos;
- personas de producto que evalúan criterio, autonomía y capacidad de entrega;
- lectores técnicos que quieren comprobar profundidad después del primer impacto.

El rediseño tiene éxito cuando un visitante puede responder, en este orden:

1. Qué tipo de problemas resuelve Gabriel.
2. Cómo conecta producto e ingeniería.
3. Qué proyecto demuestra mejor esa capacidad.
4. Dónde leer evidencia técnica concreta.

## Diagnóstico del sitio actual

La implementación existente ya tiene una base funcional sólida: HTML estático, estilos compartidos, rutas simples, contenido real y capturas de los productos. El problema es principalmente de presentación.

- La home usa un patrón conocido de hero oscuro, panel de métricas y grilla de cards.
- Las métricas `4`, `APIs` y `Ship` describen el portfolio, pero no prueban resultados.
- Los case studies repiten bloques y matrices de tags con poca variación narrativa.
- La profundidad técnica existe en el texto, pero aparece después de una primera impresión visual genérica.
- La composición alternativa en `landing-mock.html` mejora el foco en problemas reales, aunque conserva la estructura de hero, proof strip y grilla de cards.

El rediseño conserva la arquitectura estática y el contenido verificado. Cambia la jerarquía, el ritmo y la forma de presentar la evidencia.

## Dirección aprobada

La dirección visual se denomina **Proyectos de producto**.

Es un lenguaje editorial, sobrio y secuencial. La personalidad surge de la tipografía, la composición y la relación entre problema, decisión y prueba. No depende de efectos decorativos, paneles ficticios ni una estética de dashboard aplicada al portfolio.

### Principios

- Mostrar una tesis antes que una lista de skills.
- Usar capturas reales como evidencia, no como decoración.
- Explicar tecnologías como respuesta a restricciones concretas.
- Priorizar lectura y contraste sobre cantidad de componentes.
- Mantener una identidad visual única en home y páginas internas.
- Hacer que el sitio siga siendo completamente útil sin JavaScript.

## Arquitectura de la home

La home deja de ser una grilla de cards y se convierte en un índice editorial.

### 1. Navegación

Una barra compacta contiene:

- nombre de Gabriel como retorno al inicio;
- acceso a trabajo seleccionado;
- enlace externo a GitHub.

Las rutas actuales se conservan. Los enlaces externos mantienen apertura en una pestaña nueva y atributos `rel` seguros.

### 2. Hero editorial

El hero posiciona el perfil híbrido con la tesis:

> Problemas reales. Productos que operan.

El texto de apoyo explica que Gabriel diseña y construye herramientas donde datos, APIs y decisiones de producto deben convivir. No incluye métricas decorativas, collage genérico ni una enumeración de tecnologías.

### 3. Argumento de trabajo

Una secuencia breve explica el método común a los proyectos:

1. Detectar la fricción.
2. Diseñar la apuesta.
3. Construir el sistema.
4. Dejarlo operando.

Esta secuencia reemplaza el intro strip actual y prepara la lectura de los casos.

### 4. Proyecto principal

Meli Core Dumper ocupa el primer bloque y recibe mayor jerarquía. El bloque combina:

- número e identificación del caso;
- tensión de producto;
- decisión principal;
- captura real del producto;
- enlace claro al case study.

La captura debe mantenerse legible, con un recorte que muestre producto real en lugar de funcionar como fondo abstracto.

### 5. Índice de proyectos

Stock Central, Silver Usage Report y Monitor de Reviews aparecen en filas editoriales, no en cards equivalentes. Cada fila comunica una idea distintiva:

- Stock Central: jobs como backend y GitHub Pages como runtime.
- Silver Usage Report: privacidad convertida en arquitectura.
- Monitor de Reviews: una grieta concreta en la operación de sellers.

En escritorio, foco y hover pueden revelar la captura correspondiente. En pantallas táctiles, cada fila incluye su evidencia visual dentro del flujo normal.

### 6. Cierre

El cierre sintetiza la propuesta: producto para decidir e ingeniería para sostenerlo. Incluye acceso a GitHub sin agregar una biografía genérica ni inventar datos de contacto.

## Sistema de case studies

Las cuatro páginas internas comparten una columna vertebral. El contenido particular de cada proyecto se conserva y se reordena para favorecer la comprensión.

### 1. Portada del proyecto

Incluye:

- retorno al índice;
- número y categoría del caso;
- nombre del producto;
- tesis de una oración;
- rol, restricción y tipo de entrega;
- captura principal real;
- enlaces existentes a repositorio o demo cuando estén disponibles.

### 2. La fricción

Presenta el problema que originó el producto. Debe explicar el contexto antes de describir la solución.

### 3. La apuesta de producto

Explica qué cambió respecto de la forma anterior de resolver el problema y por qué esa decisión importó.

### 4. Decisiones

Cada caso destaca entre dos y cuatro decisiones concretas. Una decisión combina:

- restricción;
- elección realizada;
- consecuencia para el producto o la operación.

### 5. Sistema y evidencia

La arquitectura aparece como argumento causal, no como inventario de herramientas. Los diagramas textuales o flujos breves muestran cómo los componentes sostienen la decisión. Las tecnologías permanecen disponibles en una sección secundaria y compacta.

### 6. Resultado y continuidad

El cierre resume qué quedó funcionando sin inventar métricas. Luego ofrece acceso a los otros proyectos mediante un índice compacto.

## Narrativa por proyecto

### Meli Core Dumper

Tesis: una herramienta de exportación evolucionó hacia inteligencia de negocios dentro del producto. La prueba técnica incluye sincronización, hechos, métricas diarias, señales, multi-tenancy y observabilidad.

### Stock Central

Tesis: una fricción real del mercado 3D se resolvió con un producto comunitario de bajo costo operativo. La prueba técnica central es mover el backend a jobs programados y usar GitHub Pages como runtime estático.

### Silver Usage Report

Tesis: un requerimiento sensible se convirtió en un flujo auditable que demuestra uso de IA sin recolectar contenido privado. La prueba técnica incluye collector local, agregación, firma, validación y envío one-shot.

### Monitor de Reviews

Tesis: la falta de una vista centralizada de reviews abrió un producto enfocado en percepción y evolución por publicación. La prueba técnica incluye OAuth, polling, deduplicación y modelado de productos o familias.

## Lenguaje visual

### Color

La paleta usa cuatro roles:

- tinta: `#0c0c0f`;
- papel: `#f3f0e8`;
- señal: `#ff7142`;
- acero: `#73737c`.

El naranja funciona como señal para índices, enlaces y estados activos. No se usa como relleno decorativo repetido. El sitio conserva una base oscura y utiliza el papel cálido en superficies editoriales puntuales, siempre con contraste suficiente.

### Tipografía

El sistema usa fuentes disponibles en el sistema, sin solicitudes remotas:

- títulos editoriales: `"Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia, serif`;
- navegación y cuerpo: Aptos, `"Segoe UI"`, system-ui, sans-serif;
- índices y metadatos: `"SFMono-Regular"`, Consolas, `"Liberation Mono"`, monospace.

Esta elección evita dependencias de red y mantiene fallbacks estables en Windows, macOS y Linux.

### Forma y espaciado

- Bordes finos y divisores reemplazan la mayoría de las cards flotantes.
- Los radios se reducen y se reservan para controles o superficies que lo justifiquen.
- La jerarquía surge de escala tipográfica, espacio y alineación.
- Las capturas reciben marcos simples y recortes legibles.

### Movimiento

El movimiento es moderado y funcional:

- entrada corta de secciones cuando se vuelven relevantes;
- actualización de evidencia visual al enfocar un proyecto;
- feedback claro en enlaces y controles.

No se implementan parallax, partículas, loops continuos ni scroll secuestrado. `prefers-reduced-motion` elimina las transiciones no esenciales.

## Implementación técnica

El sitio continúa como HTML, CSS y JavaScript estáticos, compatible con GitHub Pages y sin proceso de build.

### Archivos principales

- `index.html`: nueva arquitectura editorial de la home.
- `projects/*/index.html`: estructura compartida de proyectos.
- `styles.css`: tokens, layouts, componentes y responsive compartidos.
- `script.js`: mejora progresiva para enlaces externos, revelado y evidencia contextual.
- `.gitignore`: exclusión de `.superpowers/`.

`landing-mock.html`, `landing-mock.css` y `.codex-remote-attachments/` pertenecen al estado previo del workspace y quedan fuera del cambio.

### JavaScript progresivo

El contenido, la navegación y los enlaces deben funcionar antes de ejecutar JavaScript. El script puede:

- completar atributos seguros de enlaces externos;
- activar clases de revelado mediante `IntersectionObserver`;
- actualizar la evidencia del índice de proyectos en hover o foco;
- limpiar listeners cuando corresponda.

Si `IntersectionObserver` no está disponible, todo el contenido queda visible.

### Responsive

Se validan al menos tres rangos:

- escritorio ancho;
- tablet o notebook angosta;
- móvil.

En móvil no hay interacciones que dependan de hover. Las capturas se integran al flujo, los metadatos se apilan y la navegación mantiene objetivos táctiles cómodos.

### Accesibilidad

- HTML semántico con un único `h1` por página.
- Estados `:focus-visible` perceptibles.
- Contraste AA para texto y controles.
- Texto alternativo descriptivo en las capturas.
- Navegación completa por teclado.
- Respeto de `prefers-reduced-motion`.
- Enlaces externos identificables por contexto, sin depender sólo del color.

### SEO y rendimiento

- Se conservan títulos, descripciones, rutas y contenido indexable.
- Las imágenes mantienen dimensiones explícitas para evitar saltos de layout.
- Los recursos secundarios usan carga diferida cuando no están en el primer viewport.
- No se agregan frameworks, librerías de animación ni dependencias de runtime.

## Validación

La implementación se considera terminada cuando:

1. La home y los cuatro case studies cargan sin errores desde un servidor estático.
2. Todas las rutas internas y enlaces externos existentes funcionan.
3. El sitio es legible y navegable sin JavaScript.
4. La experiencia funciona con mouse, teclado y pantalla táctil.
5. La composición se valida en escritorio, tablet y móvil.
6. `prefers-reduced-motion` elimina animaciones no esenciales.
7. No hay overflow horizontal ni saltos de layout notorios.
8. Las capturas reales se mantienen legibles.
9. No se introducen afirmaciones, métricas o enlaces no verificados.
10. Los mocks alternativos sin seguimiento no se modifican.

## Fuera de alcance

- Cambiar rutas públicas o estructura de publicación de GitHub Pages.
- Incorporar un framework o pipeline de build.
- Crear un CMS, formulario de contacto o backend.
- Generar imágenes nuevas para reemplazar capturas reales.
- Inventar métricas de impacto.
- Modificar los productos enlazados desde el portfolio.
