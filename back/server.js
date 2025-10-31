const express = require("express");
const cors = require("cors");
const kpiRoutes = require("./src/routes/kpiRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({
    message: "🚀 API de KPIs funcionando correctamente",
    version: "1.0.0",
    endpoints: {
      dashboard: "/api/kpis/dashboard",
      produccion: "/api/kpis/produccion",
      calidad: "/api/kpis/calidad",
      logistica: "/api/kpis/logistica",
      ventas: "/api/kpis/ventas",
      fallas: "/api/kpis/fallas-por-equipo",
    },
  });
});

// Rutas de KPIs
app.use("/api/kpis", kpiRoutes);

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Algo salió mal!",
    message: err.message,
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(
    `📊 Dashboard API disponible en http://localhost:${PORT}/api/dashboard`
  );
});

module.exports = app;
