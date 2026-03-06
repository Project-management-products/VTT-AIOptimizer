# Historia de Usuario 1:
1. **Título:** Anonimizar nombres de oradores en transcripciones VTT para procesamiento por IA.
2. **Descripción:** "Como el sistema de procesamiento de transcripciones, quiero anonimizar los nombres de los oradores en el archivo VTT procesado para asegurar la privacidad de los participantes y permitir el envío seguro a la IA para la generación del informe."
3. **Criterios de Aceptación:**
    * **Escenario: Anonimización exitosa de oradores.**
        * **Dado** que tengo un archivo VTT con el formato [duracion en segundos] orador: intervencion.
        * **Cuando** el sistema procesa el archivo para anonimizar los oradores.
        * **Entonces** cada nombre de orador único debe ser reemplazado por un identificador genérico consecutivo (ej. "Orador 1", "Orador 2").
        * **Y** todas las ocurrencias del mismo orador deben ser reemplazadas por el mismo identificador genérico dentro del archivo.
        * **Y** el archivo resultante debe mantener el formato [duracion en segundos] Orador N: intervencion.
    * **Escenario: Preservación del archivo original.**
        * **Dado** que se ha generado un archivo VTT anonimizado.
        * **Cuando** el proceso de anonimización finaliza.
        * **Entonces** el archivo VTT original, con los nombres de oradores sin anonimizar, debe permanecer inalterado y disponible para su descarga.
4. **Consideraciones técnicas:**
    * **Identificación de Oradores:** Implementar una lógica para parsear el formato [duracion en segundos] orador: intervencion y extraer el nombre del orador.
    * **Mapeo de Anonimización:** Utilizar una estructura de datos (ej. Map<String, String>) para mapear nombres de oradores reales a identificadores genéricos (ej. "Orador 1", "Orador 2"). Este mapeo debe ser consistente dentro de un mismo archivo de transcripción.
    * **Generación de Archivo Anonimizado:** El proceso debe generar un nuevo archivo de transcripción con los oradores anonimizados, sin modificar el archivo original.
    * **Formato de Salida:** El archivo anonimizado debe mantener el formato VTT especificado, con los identificadores genéricos de orador en lugar de los nombres reales.
    * **Rendimiento:** Considerar el rendimiento para archivos VTT de gran tamaño.

---

# Historia de Usuario 2:
1. **Título:** Generar informe de transcripción a partir de archivo VTT procesado
2. **Descripción:** "Como Sistema de Gestión de Transcripciones, quiero enviar un archivo VTT procesado a un endpoint específico y recibir el informe generado para proporcionar un análisis de la transcripción a los participantes de la reunión virtual."
3. **Criterios de Aceptación:**
    * **Dado** un archivo VTT procesado con el formato [duracion en segundos] orador: intervencion y su nombre original.
    * **Cuando** el Sistema de Gestión de Transcripciones envía este archivo al endpoint <<server_name>>/vtt-reports-analysis/generate.
    * **Entonces** el sistema recibe una respuesta HTTP 200 OK que contiene el informe de transcripción en formato JSON.
    * **Dado** un archivo VTT que no cumple con el formato esperado [duracion en segundos] orador: intervencion.
    * **Cuando** el Sistema de Gestión de Transcripciones intenta enviar este archivo al endpoint <<server_name>>/vtt-reports-analysis/generate.
    * **Entonces** el sistema recibe una respuesta HTTP 400 Bad Request indicando un error de formato de archivo.
    * **Dado** un archivo VTT procesado válido.
    * **Cuando** el Sistema de Gestión de Transcripciones envía este archivo al endpoint <<server_name>>/vtt-reports-analysis/generate y el servicio de generación de informes no está disponible o falla internamente.
    * **Entonces** el sistema recibe una respuesta HTTP 5xx y registra el error para su posterior revisión.
4. **Consideraciones técnicas:**
    * El endpoint para el envío del archivo es <<server_name>>/vtt-reports-analysis/generate.
    * El método HTTP a utilizar para el envío del archivo es POST.
    * El archivo VTT procesado debe ser enviado como multipart/form-data o en el cuerpo de la solicitud (ej. JSON con el contenido codificado), especificando el nombre original del archivo.
    * El formato del archivo VTT procesado debe adherirse estrictamente a [duracion en segundos] orador: intervencion.
    * El sistema debe mantener el archivo VTT original con su nombre para permitir descargas futuras, según el contexto del proyecto.
    * El informe recibido se espera en formato JSON, conteniendo los datos de análisis de la transcripción.
    * Se debe implementar un manejo robusto de errores para diferentes códigos de respuesta HTTP (4xx, 5xx).

---

# Historia de Usuario 3:
1. **Título:** Visualizar y Descargar Informe de Transcripción en Markdown
2. **Descripción:** "Como Participante de reunión virtual, quiero poder visualizar el informe de transcripción en formato Markdown en pantalla y tener la opción de descargarlo, para poder revisar y guardar el contenido de la reunión de forma estructurada."
3. **Criterios de Aceptación:**
    * **Escenario: Visualización del informe en pantalla.**
        * **Dado** que existe un informe de transcripción procesado en formato Markdown.
        * **Cuando** el usuario accede a la interfaz de informes.
        * **Entonces** se debe mostrar un enlace o botón etiquetado como "Visualizar Informe Markdown".
        * **Y** al hacer clic en "Visualizar Informe Markdown", el contenido del informe se renderiza en la pantalla.
        * **Y** el formato renderizado debe ser legible y mantener la estructura del Markdown original.
    * **Escenario: Descarga del informe.**
        * **Dado** que existe un informe de transcripción procesado en formato Markdown.
        * **Cuando** el usuario accede a la interfaz de informes.
        * **Entonces** se debe mostrar un botón etiquetado como "Descargar Informe Markdown".
        * **Y** al hacer clic en "Descargar Informe Markdown", el archivo Markdown se descarga en el dispositivo del usuario.
        * **Y** el nombre del archivo descargado debe corresponder al nombre original del archivo de transcripción.
        * **Y** el contenido del archivo descargado debe ser idéntico al informe Markdown generado.
4. **Consideraciones técnicas:**
    * **Renderizado Frontend:** El contenido Markdown debe ser renderizado en el navegador utilizando una librería de Markdown parser/renderer (ej. Marked.js, showdown.js) para asegurar la correcta visualización de la estructura y el formato.
    * **Endpoint API:** Se requiere un endpoint API que provea el contenido del informe de transcripción en formato Markdown. Este endpoint debe ser accesible desde el frontend.
    * **Mecanismo de Descarga:** La descarga del archivo Markdown debe implementarse utilizando un método que permita especificar el nombre del archivo (ej. <a> tag con atributo download o una función JavaScript que genere un Blob y lo descargue), asegurando que se mantenga el nombre original del archivo de transcripción.
    * **Persistencia de Nombres:** El sistema backend debe garantizar que el archivo Markdown generado después del proceso de "pruning" conserve el nombre original del archivo VTT para su posterior descarga.
