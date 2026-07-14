# Selección animada del índice de proyectos

## Objetivo

Hacer visible qué proyecto controla la captura lateral mediante una franja naranja animada que entra desde la izquierda de la fila seleccionada.

## Dirección aprobada

La interacción conserva el índice editorial existente y evita convertir las filas en cards.

- La fila activa recibe un lavado horizontal translúcido con el color `--signal`.
- Un borde naranja de `4px` funciona como frente visual de la franja.
- La franja crece desde la izquierda con `scaleX` y una transición de `320ms`.
- El estado se activa con hover, foco de teclado y la clase persistente `.is-active` que ya sincroniza la captura lateral.
- El CTA adopta el color naranja y el contenido se desplaza levemente para reforzar la selección.
- En móvil la franja se desactiva para mantener el flujo táctil actual.
- `prefers-reduced-motion` conserva el estado visual pero elimina la duración perceptible mediante la regla global existente.

## Implementación

El cambio sólo requiere `styles.css`. Se agrega un pseudo-elemento a `.work-row` y se reutiliza el contrato de estado existente; `index.html` y `script.js` no cambian.

`tests/portfolio.test.mjs` incorpora un contrato estructural para comprobar el pseudo-elemento, su origen izquierdo, el estado activo y la desactivación móvil.

## Validación

1. La franja aparece al pasar el puntero y permanece en la fila que controla la captura.
2. El foco de teclado produce el mismo estado.
3. La transición no altera el layout ni tapa el contenido.
4. En móvil no aparece el lavado persistente.
5. La suite completa sigue pasando.

## Fuera de alcance

- Cambiar el comportamiento JavaScript de las vistas previas.
- Agregar sonidos, cursores personalizados o animaciones continuas.
- Modificar contenido, rutas o capturas.
