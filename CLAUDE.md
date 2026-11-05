# Portfolio

Sitio estático para GitHub Pages (rama `master`, carpeta raíz). Sin build. Los scripts del kit son módulos ES: para verlo en local hay que servirlo por http (`python -m http.server`), no abrir el archivo directo.

## Idiomas

- El sitio es en **español** (idioma principal, en la raíz) y en **inglés** (secundario, en `/en/`).
- **Todo cambio de contenido o de texto en español se replica en inglés en el mismo cambio.** No dejar una versión desactualizada respecto de la otra. Esto incluye textos, títulos, descripciones, `alt`, enlaces y secciones nuevas o eliminadas.
- La traducción al inglés la hace Claude. Debe sonar natural, no literal; los nombres de proyectos y marcas no se traducen.
- Cada página enlaza a su equivalente con `<link rel="alternate" hreflang="es|en">` y tiene un selector de idioma en el menú. Mantener `lang` correcto en `<html>` y el sitemap con ambas versiones.
- Estructura: `index.html` y `projects/…` (español), `en/index.html` y `en/projects/…` (inglés). Mientras `/en/` no exista, esta regla aplica desde que se cree.

## Contenido

- GitHub no se destaca: no hay proyectos con estrellas u otra tracción que valga la pena mostrar. Solo un enlace discreto en el pie; no en el menú ni en los textos de cierre.
- La acción principal del sitio es "Escribirme por LinkedIn".
- No inventar métricas, clientes ni testimonios: usar solo datos reales de los proyectos.
