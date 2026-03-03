# Proyecto: VTT-AI Optimizer & Metrics Hub

## Objetivo
El proyecto consiste en una herramienta de preprocesamiento de datos que transforma archivos de transcripción en bruto (VTT) en un formato ultra-compacto y enriquecido. El sistema limpia el ruido técnico (IDs de nodo, etiquetas HTML, marcas de tiempo excesivas) y prepara un reporte estructurado que minimiza el consumo de tokens en Gemini, permitiendo procesar reuniones mucho más largas en una sola ventana de contexto.

## Requerimientos del Sistema

### Requerimientos Funcionales (RF)
| ID | Requerimiento | Descripción |
| :--- | :--- | :--- |
| **RF1** | **Parser de VTT** | El sistema debe ignorar los IDs de sesión (ej. 001ec368...) y limpiar entidades HTML (ej. convertir &#237; en í o &#241; = ñ). |
| **RF2** | **Cálculo de Duración** | La aplicación debe calcular la diferencia de tiempo entre el inicio y el fin de cada intervención individualmente.Ejm: 00:00:45.645 --> 00:00:49.325 =  3.680 segundos.. |
| **RF3** | **Agregación por Orador** | El sistema debe sumar los tiempos totales y el conteo de intervenciones por orador. |
| **RF4** | **Exportación de Formato** | Generar un archivo de texto optimizado (Markdown) para suministrar al LLM. |
| **RF5** | **Merge Orador Consecutivo** | Unir bloques de texto del mismo orador si no hay interrupción de otro orador, sumando sus duraciones y consolidando en 1 intervención. |
| **RF** | **** |  |


###
| ID | Requerimiento | Descripción |
| :--- | :--- | :--- |
| **RNF1** | **Eficiencia de Tokens** | El formato de salida debe reducir el peso del archivo original sin perder contexto. |
| **RNF2** | **Precisión Matemática** | El cálculo de tiempos debe ser exacto a nivel de milisegundos antes de redondear para el reporte. |


## Formato esperado
[Tiempo intervencion (segundos)] Orador: Mensaje 

## Ejemplo:
### Transcripción entrada (VTT)

001ec368-3c77-4441-9f7e-67031cc3b038/8-0
00:00:05.485 --> 00:00:05.725
<v Carlos Far&#237;as>No.</v>

001ec368-3c77-4441-9f7e-67031cc3b038/9-0
00:00:07.165 --> 00:00:08.845
<v Carlos Far&#237;as>Ya la voy a presentar.</v>

001ec368-3c77-4441-9f7e-67031cc3b038/12-0
00:00:27.645 --> 00:00:30.165
<v Carlos Far&#237;as>Compartir allí hoy entonces.</v>

001ec368-3c77-4441-9f7e-67031cc3b038/13-0
00:00:34.965 --> 00:00:35.245
<v Carlos Far&#237;as>It.</v>

001ec368-3c77-4441-9f7e-67031cc3b038/14-0
00:00:40.405 --> 00:00:44.245
<v Carlos Far&#237;as>vente más si ahí les llega la imagen si
se ve bien</v>

001ec368-3c77-4441-9f7e-67031cc3b038/15-0
00:00:45.645 --> 00:00:49.325
<v Alfredo Artigas>Se está viendo, pero no proyectado,
digamos.</v>

001ec368-3c77-4441-9f7e-67031cc3b038/17-0
00:00:50.005 --> 00:00:52.825
<v Carlos Far&#237;as>Claro,
deja ver si tiene proyectar donde tiene</v>

001ec368-3c77-4441-9f7e-67031cc3b038/17-1
00:00:52.825 --> 00:00:53.725
<v Carlos Far&#237;as>proyectar este.</v>

001ec368-3c77-4441-9f7e-67031cc3b038/18-0
00:00:55.365 --> 00:00:59.382
<v Carlos Far&#237;as>Es que no me dejó cargarlo a la página
web, pero eso estoy medio perdido a casa,</v>

001ec368-3c77-4441-9f7e-67031cc3b038/18-1
00:00:59.382 --> 00:01:01.565
<v Carlos Far&#237;as>rey,
pero ya lo está el botoncito proyecta.</v>

001ec368-3c77-4441-9f7e-67031cc3b038/19-0
00:01:03.245 --> 00:01:03.525
<v Carlos Far&#237;as>Um.</v>

001ec368-3c77-4441-9f7e-67031cc3b038/20-0
00:01:11.685 --> 00:01:12.645
<v Carlos Far&#237;as>Bueno, lo veo.</v>

001ec368-3c77-4441-9f7e-67031cc3b038/21-0
00:01:20.405 --> 00:01:21.605
<v Carlos Far&#237;as>Ahí está, ahí lo ven.</v>

001ec368-3c77-4441-9f7e-67031cc3b038/22-0
00:01:23.605 --> 00:01:24.165
<v Mauricio Cruzat>Sí.</v>

001ec368-3c77-4441-9f7e-67031cc3b038/23-0
00:01:23.925 --> 00:01:26.685
<v Carlos Far&#237;as>No, sí, el proyectado.</v>

001ec368-3c77-4441-9f7e-67031cc3b038/24-0
00:01:27.245 --> 00:01:27.645
<v Alfredo Artigas>No.</v>

### Salidas esperadas
#### Transcripción optimizada
[8.56s] Carlos Farías: No. Ya la voy a presentar. Compartir allí hoy entonces. It. vente más si ahí les llega la imagen si se ve bien.

[3.68s] Alfredo Artigas: Se está viendo, pero no proyectado, digamos.

[12.36s] Carlos Farías: Claro, deja ver si tiene proyectar donde tiene proyectar este. Es que no me dejó cargarlo a la página web, pero eso estoy medio perdido a casa, rey, pero ya lo está el botoncito proyecta. Um. Bueno, lo veo. Ahí está, ahí lo ven.

[0.56s] Mauricio Cruzat: Sí.

[2.76s] Carlos Farías: No, sí, el proyectado.

[0.40s] Alfredo Artigas: No.        

#### METADATOS DE LA REUNIÓN (Pre-calculados)
* **Participantes:** Carlos Farías, Alfredo Artigas, Mauricio Cruzat.
* **Tiempo Total de Habla:** 28.32 segundos.
* **Métricas por Orador:**
| Orador | Tiempo | Intervenciones originales | Consolidados |
| :--- | :--- | :--- |
|* **Carlos Farías:**| 23.68s | 13 | 3 |
|* **Alfredo Artigas:**| 4.08s | 2 | 2 |
|* **Mauricio Cruzat:**| 0.56s | 1 | 1 |