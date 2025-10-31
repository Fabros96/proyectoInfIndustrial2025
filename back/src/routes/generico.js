import express from "express";
import { pool } from "../../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const { anio, mes } = req.query;
  try {
    let sql = "SELECT * FROM kpi_produccion";
    const params = [];

    if (anio && mes) {
      sql += " WHERE anio = ? AND mes = ?";
      params.push(anio, mes);
    } else if (anio) {
      sql += " WHERE anio = ?";
      params.push(anio);
    }

    sql += " ORDER BY anio, mes";

    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener datos de producción" });
  }
});

export default router;
