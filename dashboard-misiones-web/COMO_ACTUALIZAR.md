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

Otras tablas: `misiones.csv` (nombres, colores, compromiso y conteo de iniciativas), `iniciativas.csv` (listado por eje), `ejes.csv` y `actores_especificos.csv` (gobernanza).

**En Excel:** guarda siempre como **CSV UTF-8 (delimitado por comas)** para no perder las tildes. El dashboard acepta archivos separados por `;` o por `,`.

## 2. Usar otra base de datos

En `config.js` cambia la dirección de la tabla que quieras. Por ejemplo, para que las metas vengan de una planilla de Google:

1. Crea la hoja con **las mismas columnas** que `metas.csv` (puedes importar el CSV).
2. **Archivo → Compartir → Publicar en la Web**, elige esa hoja y el formato **CSV**, y copia el enlace.
3. En `config.js` reemplaza `"datos/metas.csv"` por ese enlace, entre comillas.

Desde ahí, cada cambio que hagas en la planilla aparece en el dashboard al recargarlo, sin tocar GitHub.

También funciona con una **tabla o capa pública de ArcGIS Online**: pega la URL que termina en `/FeatureServer/0`. Debe tener las mismas columnas, con los mismos nombres.

## 3. El mapa

- Las capas vienen de la georreferenciación del documento (págs. 74–82). Por defecto se leen de `datos/mapa_m1.geojson` … `mapa_vision.geojson`; si llenas `cartografia_arcgis` en `config.js`, se leen desde ArcGIS Online (sección 4). Los colores están en `datos/estilos_capas.json`.
- Al hacer clic en una iniciativa (en el mapa, en su número o en la lista) el mapa se acerca, la resalta y muestra su ficha. Al hacer clic en una meta se filtran las iniciativas de ese eje.
- "Mostrar mapa original del documento" superpone la imagen georreferenciada del PDF, con transparencia regulable.
- El número de cada iniciativa del mapa se une con `iniciativas.csv` por misión + número. Si cambias un nombre en el CSV, cambia también en el mapa.
- Precisión de las geometrías: aprox. 250–500 m. Es cartografía estratégica, no de proyecto.

## 4. Actualizar la cartografía de las misiones

La idea es que la cartografía viva en **una sola capa de ArcGIS Online** y que el dashboard la lea de ahí. Así, agregar, borrar o mover una iniciativa se hace editando en ArcGIS, sin tocar GitHub.

### 4.1 Publicar la cartografía en ArcGIS Online (una sola vez)

1. En ArcGIS Online: **Contenido → Nuevo elemento → Su dispositivo** y elige `Mapas_Misiones_AMS.gpkg` (de la carpeta de georreferenciación). Marca **Crear una capa de entidades alojada**.
   - También puedes publicarla desde ArcGIS Pro con el proyecto que trae el paquete (`Compartir → Capa web`), siempre como **una sola capa web con todas las capas dentro**.
2. **No cambies los nombres de las capas.** El dashboard sabe a qué misión pertenece cada capa por cómo empieza su nombre:

   | El nombre empieza con | Se muestra en |
   |---|---|
   | `M1_` | Misión 1 |
   | `M2_` | Misión 2 |
   | `M3_` | Misión 3 |
   | `M4_` | Misión 4 |
   | `V_` | Mapa de la visión |

   Una capa con otro nombre no se muestra (aparece un aviso en la consola del navegador).
3. Abre el elemento → **Configuración** → activa **Habilitar edición** (agregar, actualizar y eliminar entidades).
4. **Compartir → Todos (público)**. Si no es pública, el dashboard en GitHub Pages no la puede leer.
5. Copia la URL del servicio: en la página del elemento, abajo a la derecha, **URL**. Termina en `/FeatureServer`.
6. En `config.js` pégala en `cartografia_arcgis`, entre comillas:

   ```js
   cartografia_arcgis: "https://services.arcgis.com/…/arcgis/rest/services/Mapas_Misiones_AMS/FeatureServer",
   ```

   Guarda (Commit changes). Desde ese momento los archivos `mapa_m1 … mapa_vision.geojson` ya no se usan. Para volver a ellos, deja `cartografia_arcgis: ""`.

**Campos que lee el dashboard** de cada capa (los nombres pueden ir en mayúsculas o minúsculas):

| Campo | Qué es | Ejemplo |
|---|---|---|
| `id_inic` | N.º de la iniciativa. Es el número del círculo y la unión con `iniciativas.csv`. | `25` |
| `eje` | Eje de la iniciativa. | `E3. Ejes metropolitanos` o `3` |
| `nombre` | Nombre (se usa si la iniciativa no está en `iniciativas.csv`). | `Eje Alameda…` |
| `categoria`, `nota` | Opcionales. La nota aparece en la ficha. | |

Una entidad **sin** `id_inic` se dibuja como fondo (por ejemplo, los corredores ecológicos) pero no lleva número ni se puede seleccionar.

### 4.2 Agregar una iniciativa nueva

1. Abre la capa en **Map Viewer** → **Editar** (ícono del lápiz) → **Nueva entidad**.
2. Elige la capa que corresponde (por ejemplo `M1_corredores_intervencion` si es un corredor de la Misión 1) y dibuja la línea, el punto o el polígono.
3. Llena `id_inic` con el número nuevo (uno que no exista en esa misión), `eje` y `nombre`. Guarda.
4. Si la iniciativa tiene varias partes (por ejemplo, tres tramos), dibuja cada parte con el **mismo** `id_inic`: el dashboard las trata como una sola iniciativa.
5. En GitHub, completa los datos:
   - `datos/iniciativas.csv`: agrega una fila `mision_id;eje;numero;nombre`. Si no lo haces, la iniciativa igual aparece en la lista con el nombre y eje de la capa.
   - `datos/misiones.csv`: actualiza `iniciativas_total` y `iniciativas_nuevas` o `iniciativas_cartera`. Estos conteos no se calculan solos, porque vienen del documento.

### 4.3 Eliminar una iniciativa

1. En **Map Viewer → Editar**, selecciona cada parte de la iniciativa y elimínala. Revisa que no queden partes en otras capas (con **Tabla** y un filtro `id_inic = número` en cada capa de esa misión).
2. En GitHub, borra su fila en `datos/iniciativas.csv` y ajusta los conteos en `datos/misiones.csv`.
   - Si borras solo la geometría y dejas la fila, la iniciativa sigue en la lista pero sin ubicación en el mapa (útil si se va a redibujar).

### 4.4 Modificar una iniciativa

| Quiero… | Dónde se cambia |
|---|---|
| Mover o redibujar su trazado | Map Viewer → Editar → seleccionar → mover vértices. |
| Cambiar su nombre | `datos/iniciativas.csv` (manda sobre el nombre de la capa). |
| Cambiarla de eje | `eje` en `datos/iniciativas.csv`, y también en la capa para que todo quede igual. |
| Cambiar su número | `id_inic` en **todas** sus partes de la capa **y** `numero` en `iniciativas.csv`. Si quedan distintos, no se unen. |
| Pasarla a otra misión | Copiarla a una capa con el prefijo de la otra misión, borrarla de la original y mover la fila de `iniciativas.csv` (`mision_id`). |

### 4.5 Agregar un tipo de capa nuevo

1. Crea la capa con los campos de la tabla de 4.1 y ponle a **la capa** (no solo al elemento) un nombre con el prefijo de la misión, por ejemplo `M2_paraderos_seguros`. Hay dos formas:
   - **Como elemento aparte (más simple):** en ArcGIS Online, **Nuevo elemento → Capa de entidades → Definir tu propia capa**, o sube un shapefile/GeoPackage. Compártela como pública y agrega su URL a `cartografia_arcgis` en forma de lista:

     ```js
     cartografia_arcgis: ["https://…/Mapas_Misiones_AMS/FeatureServer", "https://…/Paraderos/FeatureServer"],
     ```

   - **Dentro de la misma capa web:** desde ArcGIS Pro, agrega la clase de entidad al mapa y usa **Compartir → Sobrescribir capa web**. Antes, en ArcGIS Online haz **Exportar datos** del elemento, porque sobrescribir reemplaza lo editado en línea por lo que hay en Pro.
2. El dashboard la muestra sola, con el color de la misión. Para darle color, grosor y nombre en la leyenda, agrega una entrada en `datos/estilos_capas.json`:

   ```json
   "M2_paraderos_seguros": {"tipo": "pt", "color": "#E8605A", "tam": 7, "transp": 0, "etiqueta": "Paraderos seguros"}
   ```

   `tipo`: `pt` (punto), `lin` (línea) o `pol` (polígono). `transp`: transparencia de 0 a 100.
3. Si es una capa de la visión que debe prenderse con el botón de una misión, avísame y la agrego a la lista del mapa de la visión.

### 4.6 Revisar que quedó bien

1. Abre el dashboard y **recarga** (Ctrl + F5). Los cambios de ArcGIS se ven de inmediato.
2. Revisa en la pestaña de la misión: el número aparece en el mapa, en la lista, y al hacer clic se acerca a su ubicación.
3. Si el mapa queda vacío o aparece un aviso rojo, lo más común es que la capa no esté compartida como pública o que la URL no termine en `/FeatureServer`.

## 5. Probarlo en tu computador

Si abres `index.html` con doble clic, el navegador bloquea la lectura de los CSV y el dashboard muestra un aviso. Para verlo, súbelo a GitHub Pages (como la versión anterior) o usa un servidor local.
