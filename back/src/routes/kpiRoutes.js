const express = require("express");
const router = express.Router();
const kpiService = require("../services/kpiService");

// Obtener dashboard completo
router.get("/dashboard", async (req, res) => {
  try {
    const kpis = await kpiService.getDashboardKPIs();
    res.json(kpis);
  } catch (error) {
    console.error("Error en /dashboard:", error);
    res.status(500).json({ error: error.message });
  }
});

// Obtener KPIs de producción
router.get("/produccion", async (req, res) => {
  try {
    const kpis = await kpiService.getKPIProduccion();
    res.json(kpis);
  } catch (error) {
    console.error("Error en /produccion:", error);
    res.status(500).json({ error: error.message });
  }
});

// Obtener KPIs de calidad
router.get("/calidad", async (req, res) => {
  try {
    const kpis = await kpiService.getKPICalidad();
    res.json(kpis);
  } catch (error) {
    console.error("Error en /calidad:", error);
    res.status(500).json({ error: error.message });
  }
});

// Obtener KPIs de logística
router.get("/logistica", async (req, res) => {
  try {
    const kpis = await kpiService.getKPILogistica();
    res.json(kpis);
  } catch (error) {
    console.error("Error en /logistica:", error);
    res.status(500).json({ error: error.message });
  }
});

// Obtener KPIs de ventas
router.get("/ventas", async (req, res) => {
  try {
    const kpis = await kpiService.getKPIVentas();
    res.json(kpis);
  } catch (error) {
    console.error("Error en /ventas:", error);
    res.status(500).json({ error: error.message });
  }
});

// Obtener resumen de fallas
router.get("/fallas-por-equipo", async (req, res) => {
  try {
    const fallas = await kpiService.getResumenFallasPorEquipo();
    res.json(fallas);
  } catch (error) {
    console.error("Error en /fallas-por-equipo:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
