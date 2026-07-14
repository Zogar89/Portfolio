# Equilibrio editorial del hero en desktop

## Objetivo

Reequilibrar el primer viewport de la home en pantallas anchas y altas, especialmente monitores 4K, sin agregar contenido decorativo ni modificar la experiencia existente en notebook, tablet o móvil.

## Diagnóstico

El hero actual ocupa toda la altura disponible y distribuye la cabecera editorial y la declaración principal con `justify-content: space-between`. En pantallas altas, el espacio central crece mientras el ancho de lectura y la escala tipográfica alcanzan sus límites. El resultado conserva la jerarquía, pero el vacío se percibe accidental y empuja el mensaje principal demasiado abajo.

## Dirección aprobada

La dirección se denomina **equilibrio editorial**.

- La identidad oscura, la tipografía serif, la paleta y el contenido permanecen sin cambios.
- El ajuste se activa únicamente en viewports de al menos `1440px` de ancho y `900px` de alto.
- El hero deja de estirar el vacío central con `space-between` y pasa a centrar su declaración dentro del espacio disponible.
- La altura se limita mediante `clamp(820px, 88dvh, 1200px)`, de modo que en pantallas muy altas pueda entrar parte de la sección siguiente.
- El titular gana un ancho de línea moderado para ocupar tres líneas en lugar de una columna excesivamente estrecha cuando el viewport lo permite.
- El texto secundario conserva su alineación inferior con el titular y recibe un ancho máximo legible.

## Alcance técnico

### `styles.css`

Agregar una media query combinada para desktop ancho y alto. Dentro de ella:

- ajustar la altura, distribución y padding del hero;
- permitir que `.hero-statement` ocupe el espacio remanente y centre sus tracks;
- ampliar con moderación el ancho máximo del `h1`;
- limitar y alinear el bloque secundario.

No se modifica `index.html`, `script.js`, las páginas de proyectos ni los breakpoints existentes para tablet y móvil.

### `tests/portfolio.test.mjs`

Agregar un contrato que compruebe la existencia del breakpoint combinado y las reglas estructurales del reequilibrio. El test debe fallar antes de agregar el CSS y pasar después.

## Validación

1. La suite completa de Node pasa sin fallos.
2. El breakpoint sólo afecta viewports de al menos `1440px × 900px`.
3. El hero conserva la declaración, el CTA y la jerarquía actuales.
4. Tablet y móvil mantienen sus reglas existentes.
5. No aparecen cambios fuera de `styles.css`, el contrato de prueba y la documentación del cambio.

## Reversibilidad

El trabajo vive en la rama `codex/editorial-balance`. Si la dirección no convence, puede descartarse sin afectar `master` ni los archivos locales sin seguimiento.
