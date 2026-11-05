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

  fuentes: {
    misiones:   "datos/misiones.csv",
    metas:      "datos/metas.csv",
    ejes:       "datos/ejes.csv",
    iniciativas:"datos/iniciativas.csv",
    actores:    "datos/actores_especificos.csv",

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
