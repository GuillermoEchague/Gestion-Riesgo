# Riesgo TI · Gestión de ciberseguridad

Aplicación web local para identificar, analizar, priorizar y dar seguimiento a riesgos de tecnología de la información. Se diseñó a partir de los temas cubiertos por los materiales de la carpeta:

- **Gestión de riesgos:** identificación; amenazas y vulnerabilidades; probabilidad, severidad e impacto; clasificación, evaluación, tratamiento, monitorización e informes.
- **ISO 27001:** evaluación y tratamiento de riesgos, controles, documentación, responsabilidades, mejora continua.
- **Gobierno y gestión de TI:** alineación con objetivos del negocio, roles, estrategia y métricas.
- **Gestión de incidentes y continuidad:** impacto al negocio, respuesta, continuidad y recuperación.

Materiales de referencia principales en la carpeta: `2. Gestión de riesgos/2.4_Identificación_de_riesgos.pdf`, `2. Gestión de riesgos/1.3_Probabilidad_severidad_e_impacto.pdf`, `2. Gestión de riesgos/2.3_Clasificacion_Evaluacion_y_Respuesta.pdf`, `2. Gestión de riesgos/3.1_Control_del_Riesgo.pdf`, `2. Gestión de riesgos/3.3_Monitorizacion_e_Indicadores.pdf`, `ISO 27001/3. Planificación y soporte/S3_L1__Evaluación_y_Tratamiento_de_Riesgos.pdf`, `1. Gobierno de seguridad/2.1_Alineacion_con_objetivos_de_negocio.pdf` y `3. Gestión de incidentes/3.1_Analisis_de_Impacto_de_Negocio.pdf`.

## Uso

Abre `index.html` en un navegador moderno. No requiere instalación, servidor ni conexión a internet. Los datos se guardan en el almacenamiento local del navegador en el equipo actual. Usa **Exportar** para descargar una copia JSON del registro.

## Evaluación

El puntaje inherente se calcula como **probabilidad (1–5) × impacto (1–5)**. Los umbrales iniciales son: bajo 1–5, moderado 6–11, alto 12–19 y crítico 20–25. Estos rangos son una propuesta inicial y deben ser revisados y aprobados según el apetito de riesgo, contexto, requisitos legales y criterios de impacto de la organización.

El riesgo residual se estima con la probabilidad registrada y el impacto residual seleccionado. La estimación no demuestra la eficacia de controles: requiere validación por los responsables y evidencia. El registro no realiza escaneo técnico ni sustituye un análisis profesional, un SGSI, una evaluación de cumplimiento o la aceptación formal del riesgo.

## Alcance de esta versión

Prototipo de usuario único para trabajo local: registro, búsqueda, filtros, matriz 5×5, estados, responsables, fechas, acciones, estimación residual y exportación. No incluye autenticación, almacenamiento compartido, auditoría de cambios, notificaciones o sincronización entre equipos. Evita registrar secretos, credenciales, datos personales sensibles o detalles de explotación en el navegador.
