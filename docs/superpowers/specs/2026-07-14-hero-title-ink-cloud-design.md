# Nube de tinta del título principal

## Objetivo

Proteger la legibilidad de “Problemas reales. Productos que operan.” cuando la curva del fondo pasa detrás del texto, sin ocultar el gráfico ni convertir el título en una caja.

## Diseño aprobado

Se agregará una nube radial negra mediante un pseudo-elemento `::before` asociado al `h1` del hero.

- La nube seguirá automáticamente el ancho y la altura reales del título, incluidos sus saltos de línea.
- Tendrá una intensidad baja: centro oscuro semitransparente y desvanecimiento amplio hacia transparente.
- Quedará entre la curva y las letras mediante el contexto de apilado existente.
- No modificará el tamaño, posición, contenido ni interacción del título.
- Se aplicará solamente en resoluciones donde la curva está visible; en móvil permanecerá desactivada.
- No tendrá animación propia.

## Implementación

El `h1` será un contexto posicionado y aislado. Su `::before` usará un `radial-gradient` elíptico, un margen negativo fluido y un desenfoque moderado. La geometría dependerá del bloque tipográfico, no de medidas fijas por renglón, para responder correctamente a cualquier cambio de ancho.

## Verificación

- Confirmar que la mancha cubra el bloque completo con diferentes saltos de línea.
- Revisar 1440p, 2048×1152 y 4K.
- Confirmar que la curva siga siendo visible alrededor y parcialmente debajo del título.
- Confirmar que no aparezca en el breakpoint móvil.
- Ejecutar las pruebas existentes y agregar una regresión para el pseudo-elemento responsivo.
