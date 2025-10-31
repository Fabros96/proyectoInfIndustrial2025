import express from "express";
import { pool } from "../../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { anios } = req.query;
    let query =
      // "SELECT * FROM kpi_ventas";
      "SELECT t.anio AS anio,t.mes AS mes,p.horas_produccion,p.horas_improductivas AS tiempos_muertos_hs,p.unidades_producidas,p.costo_total_produccion,p.unidades_sin_defectos,p.equipo_con_fallas,l.total_pedidos,l.pedidos_entregados_a_tiempo AS pedidos_entregados_en_tiempo,l.tiempo_entrega_dias AS tiempo_entrega_pedidos_dias FROM tiempo t JOIN produccion p ON t.id_tiempo = p.id_tiempo JOIN logistica l ON t.id_tiempo = l.id_tiempo ORDER BY t.anio, t.mes;"; 
    let params = [];

    if (anios) {
      const listaAnios = anios.split(",").map(Number);
      const placeholders = listaAnios.map(() => "?").join(",");
      query += ` WHERE anio IN (${placeholders})`;
      params = listaAnios;
    }

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error("Error en /api/ventas:", error);
    res.status(500).json({ message: "Error al obtener datos de ventas" });
  }
});

export default router;
