# Navegación por secciones en desktop

## Objetivo

Facilitar el recorrido de la home del portfolio en pantallas de escritorio sin secuestrar el scroll ni modificar la experiencia móvil que ya funciona bien.

## Dirección aprobada

La home conservará el desplazamiento libre. En desktop incorporará una guía vertical discreta, fija sobre el borde derecho, que permitirá reconocer la sección visible y saltar directamente entre los cuatro bloques principales.

Los destinos serán:

1. Inicio.
2. Método.
3. Proyectos.
4. Cierre.

## Comportamiento

- La guía aparecerá únicamente desde `1180px` de ancho, cuando la home ya utiliza su composición de escritorio.
- Cada destino será un enlace nativo a un identificador de sección.
- El destino correspondiente a la sección visible tendrá un estado activo perceptible.
- Al activar un enlace se conservará el desplazamiento suave existente.
- La rueda, el trackpad, las teclas y la barra de scroll continuarán funcionando de manera libre.
- La sección de proyectos podrá recorrerse internamente sin que la página intente forzar un salto al bloque siguiente.
- Si JavaScript no está disponible, los enlaces seguirán funcionando; sólo se perderá la actualización automática del estado activo.
- Con `prefers-reduced-motion: reduce`, la navegación no animará el desplazamiento.

## Presentación

- La guía será compacta y coherente con el sistema editorial existente: tinta oscura, papel, señal naranja y tipografía monoespaciada para los rótulos.
- El estado inactivo tendrá contraste secundario y el estado activo utilizará la señal naranja.
- Los rótulos serán legibles sin depender únicamente de puntos o color.
- La guía no cubrirá contenido, no alterará el ancho de la composición y no agregará otro bloque al header.
- En tablet y móvil permanecerá oculta.

## Implementación

### HTML

- Asignar identificadores estables a Método y Cierre, conservando `inicio` y `proyectos`.
- Agregar una navegación secundaria con cuatro enlaces y un nombre accesible propio.
- Exponer el estado activo mediante `aria-current="location"`.

### CSS

- Posicionar la guía de manera fija en desktop ancho.
- Mantener objetivos interactivos cómodos y estados `hover` y `focus-visible` claros.
- Ocultarla por defecto y habilitarla mediante `@media (min-width: 1180px)`.
- Compensar la cabecera sticky con `scroll-margin-top` en las secciones de destino.

### JavaScript

- Usar `IntersectionObserver` para observar los cuatro destinos.
- Elegir como activa la sección que ocupa la zona principal del viewport.
- Actualizar clases y `aria-current` sin escuchar continuamente el evento `scroll`.
- Mantener una degradación segura cuando `IntersectionObserver` no esté disponible.

## Accesibilidad

- La navegación tendrá `aria-label` descriptivo.
- Cada control será un enlace real y navegable por teclado.
- El estado activo será visible por forma, texto y color.
- El foco conservará el tratamiento naranja existente.
- La funcionalidad principal no dependerá de JavaScript.

## Validación

La implementación se considerará terminada cuando:

1. Los cuatro enlaces llevan a la sección correcta.
2. La guía sólo aparece en desktop ancho.
3. El indicador activo se actualiza al recorrer la página en ambos sentidos.
4. La sección de proyectos mantiene scroll interno libre dentro de su altura natural.
5. El contenido no queda oculto detrás de la cabecera sticky.
6. El recorrido sigue funcionando con teclado y sin JavaScript.
7. `prefers-reduced-motion` evita el desplazamiento animado.
8. Los tests existentes y los tests específicos del nuevo contrato pasan.

## Fuera de alcance

- Implementar scroll-snap obligatorio.
- Interceptar la rueda o el trackpad.
- Modificar las páginas de los proyectos.
- Cambiar el diseño del header.
- Mostrar la guía en móvil o tablet.
