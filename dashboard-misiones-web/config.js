/* ============================================================
   CONFIGURACIÓN DEL DASHBOARD: de dónde se leen los datos
   ------------------------------------------------------------
   Cada tabla puede venir de:
   1. Un archivo CSV de la carpeta "datos" (opción por defecto).
   2. Una hoja de Google Sheets publicada como CSV
      (Archivo > Compartir > Publicar en la Web > CSV): pega aquí el enlace.
   3. Una capa o tabla de ArcGIS Online (URL que termina en /FeatureServer/0).
      La capa debe ser pública y tener las mismas columnas que el CSV.
   Solo cambia el texto entre comillas. No borres las comas.
   ============================================================ */
window.CONFIG = {
  anio_meta: 2041,

  /* CARTOGRAFÍA DESDE ARCGIS ONLINE
     URL del servicio de capas de entidades de las misiones (la que termina en /FeatureServer).
     Si está llena, el mapa lee TODAS sus capas desde ahí y no usa los archivos mapa_m1 … mapa_vision.
     Cada capa se reconoce por su nombre (los nombres publicados están en datos/estilos_capas.json, en "alias")
     y su misión por el campo "mision" de sus elementos. Las copias de capas del grupo Visión se ignoran:
     el mapa de la visión toma las capas de cada misión.
     Si una capa nueva se publicó como un elemento aparte, pon las URL en una lista:
       cartografia_arcgis: ["https://…/Misiones_Metropolitanas_WFL1/FeatureServer", "https://…/Capa_nueva/FeatureServer"],
     Para que una URL completa se asigne a una sola misión, usa un objeto: { m1: "https://…", vision: "https://…" }.
     Déjala vacía ("") para usar los archivos de la carpeta datos. */
  cartografia_arcgis: "https://services9.arcgis.com/kKJR3Qt68ohAWuet/arcgis/rest/services/Misiones_Metropolitanas_WFL1/FeatureServer",

  fuentes: {
    misiones:   "datos/misiones.csv",
    metas:      "datos/metas.csv",
    ejes:       "datos/ejes.csv",
    iniciativas:"datos/iniciativas.csv",
    actores:    "datos/actores_especificos.csv",
    descripciones: "datos/actores_descripcion.csv",

    /* Capas del mapa (GeoJSON). También aceptan una capa de ArcGIS Online (/FeatureServer/0). */
    mapa_m1:     "datos/mapa_m1.geojson",
    mapa_m2:     "datos/mapa_m2.geojson",
    mapa_m3:     "datos/mapa_m3.geojson",
    mapa_m4:     "datos/mapa_m4.geojson",
    mapa_vision: "datos/mapa_vision.geojson",
    estilos:     "datos/estilos_capas.json",
    limites_doc: "datos/limites_mapas_documento.json"
  }
};
