# Portfolio GitHub

Portfolio personal para mostrar proyectos propios en GitHub Pages.

La home funciona como indice curado y cada proyecto tiene una mini pagina tipo case study:

- `projects/stock-central/`
- `projects/meli-core-dumper/`
- `projects/monitor-reviews/`

## Desarrollo local

Es un sitio estático, sin build. Hay que servirlo por http (por ejemplo `python -m http.server 8788`): abrir `index.html` directo no funciona porque los scripts son módulos ES.

Está en español (raíz) y en inglés (`/en/`). Ver `CLAUDE.md` para la regla de traducción.

## Publicación

El repositorio está pensado para publicarse con GitHub Pages desde la rama `master`, carpeta raíz.
