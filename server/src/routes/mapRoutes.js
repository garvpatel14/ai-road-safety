const express = require('express');
const router = express.Router();
const {
  getHazardsGeoJSON,
  getRqiSegments,
  getHeatmapPoints,
  planSafeRoute,
  logGpsTelemetry,
} = require('../controllers/mapController');

// PostGIS spatial endpoints
router.get('/hazards-geojson', getHazardsGeoJSON);
router.get('/rqi-segments', getRqiSegments);
router.get('/heatmap-points', getHeatmapPoints);
router.post('/safe-route', planSafeRoute);
router.post('/telemetry/gps', logGpsTelemetry);

module.exports = router;
