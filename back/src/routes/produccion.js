import express from "express";
import { pool } from "../../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { anios } = req.query;
    let query = "SELECT * FROM kpi_produccion";
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
    console.error("Error en /api/produccion:", error);
    res.status(500).json({ message: "Error al obtener datos de producción" });
  }
});

export default router;
