# Historia de Usuario:
**Título:** Limpieza de IDs de Sesión y Entidades HTML en Transcripciones VTT
**Descripción:** "Como el sistema de preprocesamiento VTT, quiero ignorar los IDs de sesión y limpiar las entidades HTML para asegurar que el contenido de la transcripción sea puro y optimizado para el procesamiento por LLMs."
**Criterios de Aceptación:**
* **Escenario: Eliminación de IDs de Sesión**
    * **Dado** un archivo VTT de entrada que contiene IDs de sesión (ej. 001ec368...)
    * **Cuando** el sistema procesa el archivo
    * **Entonces** los IDs de sesión deben ser eliminados del contenido de salida.
* **Escenario: Conversión de Entidades HTML**
    * **Dado** un archivo VTT de entrada que contiene entidades HTML (ej. &#237;, &#241;)
    * **Cuando** el sistema procesa el archivo
    * **Entonces** las entidades HTML deben ser convertidas a sus caracteres correspondientes (ej. í, ñ) en el contenido de salida.
* **Escenario: Preservación del Contenido Relevante**
    * **Dado** un archivo VTT de entrada con texto y entidades HTML
    * **Cuando** el sistema limpia el archivo
    * **Entonces** el texto relevante de la transcripción debe permanecer intacto y legible, sin pérdida de contexto.
    
**Consideraciones técnicas:**
* Implementar un mecanismo de filtrado basado en expresiones regulares o patrones para identificar y remover los IDs de sesión.
* Utilizar una librería o función de decodificación de entidades HTML estándar para asegurar la correcta conversión de caracteres especiales.
* El proceso de limpieza debe ser eficiente para no afectar el rendimiento general del preprocesamiento.
* Asegurar que la limpieza no introduzca caracteres no deseados ni modifique el significado del texto original.
* Considerar la compatibilidad con diferentes codificaciones de caracteres en los archivos VTT de entrada.

---

# Historia de Usuario:
**Título:** Consolidación de Intervenciones por Orador
**Descripción:** Como usuario del sistema, quiero unir bloques de texto consecutivos del mismo orador para consolidar sus intervenciones y optimizar el tamaño del reporte final.
**Criterios de Aceptación:**
* **Dado:** Un archivo VTT con dos o más bloques de texto consecutivos atribuidos al mismo orador, sin interrupciones de otros oradores.
* **Cuando:** El sistema procesa el archivo VTT.
* **Entonces:** Los bloques de texto se consolidan en una única intervención, sumando sus duraciones y manteniendo el contenido textual en orden cronológico.
* **Dado:** Un archivo VTT con bloques de texto de un orador A, seguido de una intervención de un orador B, y luego nuevamente un bloque del orador A.
* **Cuando:** El sistema procesa el archivo VTT.
* **Entonces:** Los bloques del orador A antes y después de la intervención del orador B no se consolidan entre sí, manteniendo intervenciones separadas.
* **Dado:** Dos bloques de texto consecutivos del mismo orador con duraciones de 00:00:05.123 y 00:00:03.456.
* **Cuando:** El sistema consolida estos bloques.
* **Entonces:** La duración de la intervención consolidada es 00:00:08.579.

**Consideraciones técnicas:**
* Implementar un algoritmo para identificar secuencias contiguas de intervenciones del mismo orador.
* La duración de la intervención consolidada debe calcularse sumando las duraciones individuales con precisión de milisegundos.
* El tiempo de inicio de la intervención consolidada será el tiempo de inicio del primer bloque de la secuencia.
* El tiempo de fin de la intervención consolidada será el tiempo de fin del último bloque de la secuencia.
* El contenido textual de los bloques consolidados debe concatenarse en el orden original.
* Validar que la consolidación contribuya a la reducción del peso del archivo en al menos un 60% y minimice el consumo de tokens.

---

# Historia de Usuario:
**Título:** Cálculo de Duración de Intervenciones
**Descripción:** Como el sistema de preprocesamiento, quiero calcular la duración exacta de cada intervención individual en el archivo VTT para enriquecer el reporte de métricas y optimizar el análisis.
**Criterios de Aceptación:**
* **Escenario 1: Cálculo de duración estándar.**
    * **Dado** un segmento de intervención con un tiempo de inicio y fin en formato HH:MM:SS.mmm.
    * **Cuando** el sistema procesa el segmento.
    * **Entonces** la duración calculada debe ser la diferencia exacta entre el tiempo de fin y el tiempo de inicio, expresada en milisegundos.
* **Escenario 2: Ejemplo de cálculo con milisegundos.**
    * **Dado** un tiempo de inicio "00:00:45.645" y un tiempo de fin "00:00:49.325".
    * **Cuando** el sistema calcula la duración.
    * **Entonces** la duración resultante debe ser "3.680" segundos.
* **Escenario 3: Manejo de tiempos con segundos completos.**
    * **Dado** un tiempo de inicio "00:01:00.000" y un tiempo de fin "00:01:05.000".
    * **Cuando** el sistema calcula la duración.
    * **Entonces** la duración resultante debe ser "5.000" segundos.
    
**Consideraciones técnicas:**
* El cálculo debe realizarse a nivel de milisegundos, manteniendo la precisión antes de cualquier posible redondeo para la presentación final del reporte.
* Los tiempos de inicio y fin se extraerán directamente de las marcas de tiempo del formato VTT (HH:MM:SS.mmm).
* La duración calculada debe almacenarse como un valor numérico de punto flotante o decimal para su posterior uso en agregaciones y métricas.
* Se debe asegurar la correcta conversión de las cadenas de tiempo a un formato numérico para realizar las operaciones aritméticas.

---

# Historia de Usuario:
**Título:** Cálculo de Métricas de Participación por Orador
**Descripción:** "Como el sistema de procesamiento de VTT, quiero calcular el tiempo total de habla y el número de intervenciones por cada orador para incluir estas métricas en el reporte final."
**Criterios de Aceptación:**
* **Escenario: Cálculo correcto de tiempo y conteo para múltiples oradores.**
    * **Dado** un archivo VTT preprocesado que contiene múltiples intervenciones de diferentes oradores,
    * **Cuando** el sistema procesa el archivo para extraer métricas,
    * **Entonces** el reporte final debe incluir el tiempo total de habla (en milisegundos) y el conteo de intervenciones para cada orador identificado.
* **Escenario: Precisión del cálculo de tiempo.**
    * **Dado** un archivo VTT preprocesado con intervenciones de oradores,
    * **Cuando** el sistema calcula el tiempo total de habla por orador,
    * **Entonces** el cálculo debe ser exacto a nivel de milisegundos antes de cualquier redondeo para el reporte.

**Consideraciones técnicas:**
* El sistema debe identificar los oradores de manera consistente utilizando las etiquetas de orador presentes en el formato VTT (e.g., <v SpeakerName>).
* La duración de cada intervención se calculará a partir de las marcas de tiempo de inicio y fin de cada segmento de diálogo.
* Los tiempos acumulados por orador deben mantenerse en milisegundos para asegurar la precisión requerida.
* La estructura de datos para almacenar las métricas por orador debe ser optimizada para su posterior integración en el reporte estructurado.
* Se debe considerar la agregación de tiempos para intervenciones no consecutivas del mismo orador.

---

# Historia de Usuario:
**Título:** Generar Reporte Optimizado en Markdown para LLM
**Descripción:** "Como usuario de la herramienta de optimización, quiero generar un archivo de texto optimizado en formato Markdown a partir de un VTT para suministrarlo a un LLM y procesar reuniones más largas con menor consumo de tokens."
**Criterios de Aceptación:**
* **Dado** un archivo VTT de entrada que contiene ruido técnico (IDs de nodo, etiquetas HTML, marcas de tiempo excesivas)
* **Cuando** el usuario procesa el archivo VTT a través de la herramienta
* **Entonces** se genera un archivo de texto optimizado en formato Markdown.
* **Dado** un archivo VTT de entrada
* **Cuando** el archivo es procesado por la herramienta
* **Entonces** el archivo de salida reduce su peso en al menos un 60% respecto al original.
* **Dado** un archivo VTT de entrada
* **Cuando** el archivo es procesado por la herramienta
* **Entonces** el archivo de salida mantiene el contexto original de la transcripción.
* **Dado** un archivo VTT de entrada con marcas de tiempo
* **Cuando** el archivo es procesado por la herramienta
* **Entonces** las marcas de tiempo en el reporte se calculan con precisión de milisegundos antes del redondeo final.
* **Dado** un archivo VTT de entrada con ruido técnico (IDs de nodo, etiquetas HTML, marcas de tiempo excesivas)
* **Cuando** el archivo es procesado por la herramienta
* **Entonces** el ruido técnico es eliminado del archivo de salida.

**Consideraciones técnicas:**
* Desarrollo de un algoritmo de limpieza para identificar y eliminar IDs de nodo, etiquetas HTML y marcas de tiempo redundantes o excesivas del VTT.
* Implementación de una métrica para calcular la reducción de peso del archivo (bytes o caracteres) y asegurar el cumplimiento del umbral del 60%.
* Diseño de la lógica de procesamiento de tiempo para garantizar la exactitud a nivel de milisegundos antes de cualquier operación de redondeo para el reporte final.
* Definición de la estructura y sintaxis del formato Markdown para el archivo de salida optimizado.
* Mecanismo de validación para asegurar que la eliminación de ruido no compromete la integridad semántica o el contexto de la transcripción original.