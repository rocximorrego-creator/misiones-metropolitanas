# Cómo actualizar el dashboard de misiones

El dashboard ya no tiene los datos dentro del código. Todo lo que muestra se lee de los archivos de la carpeta `datos/`, y `config.js` indica de dónde sale cada tabla.

## 1. Cambiar un valor (por ejemplo, el "Actual" de una meta)

1. Abre `datos/metas.csv`. En GitHub: entra al archivo → ícono del lápiz. También puedes abrirlo en Excel.
2. Busca la fila de la meta (`mision_id` y `eje`) y cambia `valor_actual`. Puedes usar coma o punto decimal (`38,2` o `38.2`).
3. Guarda (en GitHub: **Commit changes**). En uno o dos minutos el dashboard se actualiza: el texto "Actual", la barra y el "faltan / reducir" se recalculan solos.

Columnas de `metas.csv`:

| Columna | Para qué sirve |
|---|---|
| `tipo` | `cuantitativa` (con barra) o `gestion` (solo texto, por ejemplo "Mesa en operación"). |
| `sentido` | `aumentar` o `reducir`. Define si se muestra "faltan" o "reducir". |
| `valor_actual`, `valor_meta` | Los números de la meta. |
| `valor_maximo` | El final de la barra (por ejemplo, 100 en un porcentaje o 52 en comunas). |
| `unidad` | `%`, `/13`, `de 12`, `comunas`, etc. Se agrega al número. |
| `meta_prefijo` | Texto antes de la meta, por ejemplo `máx.` |
| `meta_texto`, `actual_texto` | **Solo si quieres un texto distinto al número** (y siempre en las metas de gestión). Si escribes algo aquí, se muestra tal cual y no se calcula. |
| `fecha_dato`, `fuente_dato` | Opcional. Si los llenas aparece "Dato 2025 · INE" bajo el valor. |

Otras tablas: `misiones.csv` (nombres, colores, compromiso y conteo de iniciativas), `iniciativas.csv` (listado por eje), `ejes.csv`, `actores_especificos.csv` (gobernanza) y `actores_descripcion.csv` (el texto que aparece al hacer clic en un actor de la gobernanza: columna `actor` con el nombre tal como se ve en el cuadro y columna `descripcion`).

**En Excel:** guarda siempre como **CSV UTF-8 (delimitado por comas)** para no perder las tildes. El dashboard acepta archivos separados por `;` o por `,`.

## 2. Usar otra base de datos

En `config.js` cambia la dirección de la tabla que quieras. Por ejemplo, para que las metas vengan de una planilla de Google:

1. Crea la hoja con **las mismas columnas** que `metas.csv` (puedes importar el CSV).
2. **Archivo → Compartir → Publicar en la Web**, elige esa hoja y el formato **CSV**, y copia el enlace.
3. En `config.js` reemplaza `"datos/metas.csv"` por ese enlace, entre comillas.

Desde ahí, cada cambio que hagas en la planilla aparece en el dashboard al recargarlo, sin tocar GitHub.

También funciona con una **tabla o capa pública de ArcGIS Online**: pega la URL que termina en `/FeatureServer/0`. Debe tener las mismas columnas, con los mismos nombres.

## 3. El mapa

- Las capas vienen de la georreferenciación del documento (págs. 74–82). Por defecto se leen de `datos/mapa_m1.geojson` … `mapa_vision.geojson`; como `cartografia_arcgis` en `config.js` tiene la URL de ArcGIS Online, se leen desde ahí (sección 4). Los colores están en `datos/estilos_capas.json`.
- Al hacer clic en una iniciativa (en el mapa, en su número o en la lista) el mapa se acerca, la resalta y muestra su ficha. Al hacer clic en una meta se filtran las iniciativas de ese eje.
- "Mostrar mapa original del documento" superpone la imagen georreferenciada del PDF, con transparencia regulable.
- El número de cada iniciativa del mapa se une con `iniciativas.csv` por misión + número. Si cambias un nombre en el CSV, cambia también en el mapa.
- Precisión de las geometrías: aprox. 250–500 m. Es cartografía estratégica, no de proyecto.

## 4. Actualizar la cartografía de las misiones

La cartografía vive en **una capa web de ArcGIS Online**: `Misiones_Metropolitanas_WFL1`. El dashboard la lee cada vez que se abre, así que agregar, borrar o mover una iniciativa se hace editando en ArcGIS, sin tocar GitHub.

### 4.1 Cómo lee el dashboard la capa

- **La dirección** está en `config.js`, en `cartografia_arcgis`. Es la URL que termina en `/FeatureServer`. Si la dejas vacía (`""`), el mapa vuelve a usar los archivos `datos/mapa_m1 … mapa_vision.geojson`.
- **La capa debe estar compartida como pública** (Compartir → Todos). Para editarla en Map Viewer, en el elemento → **Configuración** activa **Habilitar edición**.
- **La misión** de cada capa sale del campo `mision` de sus elementos (`Misión 1: …`, `Visión: …`). Por eso, toda entidad nueva debe llevar ese campo lleno.
- **El tipo de capa** se reconoce por su nombre publicado. Los nombres conocidos están en `datos/estilos_capas.json`, en la lista `alias` de cada capa, sin importar mayúsculas ni tildes. Ahí también están su color, grosor y nombre en la leyenda.
- **Los grupos** del mapa (M1–M4 y Visión) no viajan al servicio, y las copias de capas dentro del grupo Visión se ignoran: el mapa de la visión del dashboard se arma con las capas de cada misión.
- **Las capas "Iniciativa(s)"** (las etiquetas con el número) no se dibujan como capa: dan la posición del círculo con el número de cada iniciativa.
- Algunas capas auxiliares (por ejemplo, los ejes que sirven de base a los buffers) tienen `"oculta": true` en `estilos_capas.json` y no se dibujan.

**Campos de cada entidad** (mayúsculas o minúsculas da igual):

| Campo | Qué es | Ejemplo |
|---|---|---|
| `mision` | Misión a la que pertenece. **Obligatorio.** | `Misión 1: Santiago integrado y accesible` |
| `id_inic` | N.º de la iniciativa. Es el número del círculo y la unión con `iniciativas.csv`. | `25` |
| `eje` | Eje de la iniciativa. | `E3. Ejes metropolitanos` |
| `nombre` | Nombre (se usa si la iniciativa no está en `iniciativas.csv`). | `Eje Alameda…` |
| `categoria`, `nota` | Opcionales. La nota aparece en la ficha. | |

Una entidad **sin** `id_inic` se dibuja como fondo (por ejemplo, los corredores ecológicos), pero no lleva número ni se puede seleccionar.

### 4.2 Agregar una iniciativa nueva

1. Abre la capa web en **Map Viewer** → **Editar** (ícono del lápiz) → **Nueva entidad**.
2. Elige la capa que corresponde dentro del grupo de su misión (por ejemplo, *Corredores ejes metropolitanos (buffer)* para un corredor de la Misión 1) y dibuja el polígono, la línea o el punto.
3. Llena `mision`, `id_inic` (un número que no exista en esa misión), `eje` (`E2. …`) y `nombre`. Guarda.
4. Si la iniciativa tiene varias partes (por ejemplo, tres tramos), dibuja cada una con el **mismo** `id_inic`: el dashboard las trata como una sola iniciativa.
5. **Recomendado:** en la capa **Iniciativas** de esa misión, agrega un punto donde quieras ver el número, con el mismo `mision` e `id_inic`. Si no lo haces, el número se pone sobre la geometría.
6. En GitHub, completa los datos:
   - `datos/iniciativas.csv`: agrega una fila `mision_id;eje;numero;nombre`. Si no lo haces, la iniciativa igual aparece en la lista con el nombre y el eje de la capa.
   - `datos/misiones.csv`: actualiza `iniciativas_total` y `iniciativas_nuevas` o `iniciativas_cartera`. Estos conteos no se calculan solos, porque vienen del documento.

Una iniciativa que solo tiene su punto en la capa **Iniciativas**, sin otra geometría, se muestra solo con su número. Es lo que pasa hoy con las iniciativas 10, 16, 19 y 20 de la Misión 1.

### 4.3 Eliminar una iniciativa

1. En **Map Viewer → Editar**, selecciona cada parte de la iniciativa y elimínala, **incluido su punto en la capa Iniciativas**. Para encontrar todas las partes, abre la **Tabla** de cada capa de esa misión y filtra por `id_inic`.
2. En GitHub, borra su fila en `datos/iniciativas.csv` y ajusta los conteos en `datos/misiones.csv`.
   - Si borras solo la geometría y dejas la fila, la iniciativa sigue en la lista pero sin ubicación en el mapa (útil si se va a redibujar).

### 4.4 Modificar una iniciativa

| Quiero… | Dónde se cambia |
|---|---|
| Mover o redibujar su trazado | Map Viewer → Editar → seleccionar → mover vértices. Mueve también su punto en **Iniciativas**. |
| Cambiar su nombre | `datos/iniciativas.csv` (manda sobre el nombre de la capa). |
| Cambiarla de eje | `eje` en `datos/iniciativas.csv`, y también en la capa para que todo quede igual. |
| Cambiar su número | `id_inic` en **todas** sus partes (y en su punto de **Iniciativas**) **y** `numero` en `iniciativas.csv`. Si quedan distintos, no se unen. |
| Pasarla a otra misión | Copiarla a la capa de la otra misión, cambiar `mision`, borrarla de la original y mover la fila de `iniciativas.csv` (`mision_id`). |

### 4.5 Agregar un tipo de capa nuevo

1. Agrega la capa al proyecto de ArcGIS Pro dentro del grupo de su misión, con los campos de la tabla de 4.1, y vuelve a publicar con **Compartir → Sobrescribir capa web**. Antes, en ArcGIS Online haz **Exportar datos** del elemento, porque sobrescribir reemplaza lo editado en línea por lo que hay en Pro.
   - Alternativa: publicarla como un elemento aparte y agregar su URL a `cartografia_arcgis` en forma de lista (`["https://…/Misiones_Metropolitanas_WFL1/FeatureServer", "https://…/Capa_nueva/FeatureServer"]`). Sus elementos también deben tener el campo `mision`.
2. **Sin hacer nada más**, el dashboard la dibuja en su misión, con el color de su simbología en ArcGIS y su nombre en la leyenda.
3. Para darle color, grosor y nombre propios, agrega una entrada en `datos/estilos_capas.json` y pon el **nombre exacto con que se publicó** en `alias`:

   ```json
   "M2_paraderos_seguros": {"tipo": "pt", "color": "#E8605A", "tam": 7, "transp": 0,
     "etiqueta": "Paraderos seguros", "alias": ["Paraderos seguros"]}
   ```

   `tipo`: `pt` (punto), `lin` (línea) o `pol` (polígono). `transp`: transparencia de 0 a 100. Con `"oculta": true` la capa no se dibuja.
4. **Si cambias el nombre de una capa** en ArcGIS Pro o en Online, agrega el nombre nuevo a su lista `alias`. Si no, se dibuja con el estilo por defecto.

### 4.6 Revisar que quedó bien

1. Abre el dashboard y **recarga** (Ctrl + F5). Los cambios de ArcGIS se ven de inmediato.
2. En la pestaña de la misión, revisa que el número aparece en el mapa y en la lista, y que al hacer clic se acerca a su ubicación.
3. Si el mapa queda vacío o aparece un aviso rojo, lo más común es que la capa no esté compartida como pública o que la URL de `config.js` no termine en `/FeatureServer`.
4. Si una capa nueva no aparece, probablemente sus elementos no tienen el campo `mision` lleno. El navegador lo avisa en la consola (F12) con el mensaje "Capa sin misión".

## 5. Probarlo en tu computador

Si abres `index.html` con doble clic, el navegador bloquea la lectura de los CSV y el dashboard muestra un aviso. Para verlo, súbelo a GitHub Pages (como la versión anterior) o usa un servidor local.
