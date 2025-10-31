import mysql from "mysql2/promise";

export const pool = mysql.createPool({
  host: "localhost",
  user: "root", // tu usuario MySQL
  password: "root", // tu contraseña
  database: "sportmax",
});
