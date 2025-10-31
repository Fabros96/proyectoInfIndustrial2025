/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card } from "../components/ui/card";
import CardContent from "../components/ui/cardContent";
import { useNavigate } from "react-router-dom";

export default function Ventas() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCharts, setLoadingCharts] = useState(false);
  const [availableYears, setAvailableYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("todos");
  const navigate = useNavigate();

  // Función para traer datos
  const fetchData = async () => {
    setLoadingCharts(true);
    try {
      const res = await fetch(`http://localhost:3000/api/kpis/ventas`);
      const result = await res.json();
      setData(result);
      if (!loading) console.log(JSON.stringify(result, null, 2));
      // Guardar años disponibles solo una vez
      if (!availableYears.length && result.length) {
        const años = Array.from(new Set(result.map((d) => d.anio))).sort();
        setAvailableYears(años);
      }
    } catch (err) {
      console.error("Error al cargar datos de ventas:", err);
    } finally {
      setLoadingCharts(false);
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    setLoading(true);
    fetchData().finally(() => setLoading(false));
  }, []);

  // Filtrar datos según el año seleccionado
  const dataFiltrada =
    selectedYear === "todos"
      ? data
      : data.filter((item) => item.anio === parseInt(selectedYear));

  if (!data.length)
    return <p className="text-center mt-10">Cargando datos de ventas...</p>;

  const ultimo = dataFiltrada[dataFiltrada.length - 1];

  const formatMes = (mes, anio) => {
    const meses = [
      "Ene",
      "Feb",
      "Mar",
      "Abr",
      "May",
      "Jun",
      "Jul",
      "Ago",
      "Sep",
      "Oct",
      "Nov",
      "Dic",
    ];
    return `${meses[mes - 1]}.${anio.toString().slice(2)}'`;
  };

  const dataConMesFormateado = dataFiltrada.map((item) => ({
    ...item,
    mes_label: formatMes(item.mes, item.anio),
  }));

  // Obtener título dinámico según filtro
  const getTitulo = () => {
    if (selectedYear === "todos") {
      return "Todos los años";
    }
    return `Año ${selectedYear}`;
  };

  const renderCharts = () => {
    if (loadingCharts)
      return (
        <p className="text-center text-white text-lg mt-6">
          🔄 Cargando gráficos...
        </p>
      );

    return (
      <>
        {/* Gráfico 1: Ventas Totales */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              Evolución de Ventas Totales - {getTitulo()}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={dataConMesFormateado}
                margin={{ top: 20, right: 40, bottom: 50, left: 60 }}
              >
                <CartesianGrid stroke="white" strokeDasharray="3 3" />
                <XAxis
                  dataKey="mes_label"
                  label={{
                    value: "Mes",
                    position: "insideBottom",
                    offset: -25,
                    fill: "#ffffff",
                  }}
                  tick={{ fill: "#ffffff" }}
                />
                <YAxis
                  label={{
                    value: "Ventas ($)",
                    angle: -90,
                    position: "insideLeft",
                    offset: -25,
                    fill: "#ffffff",
                  }}
                  tick={{ fill: "#ffffff" }}
                />
                <Tooltip
                  formatter={(value) => `$${Number(value).toLocaleString()}`}
                  contentStyle={{
                    backgroundColor: "#000",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                  itemStyle={{ color: "#fff" }}
                  labelStyle={{ color: "#aaa" }}
                  cursor={{ stroke: "#888", strokeWidth: 1 }}
                />
                <Legend verticalAlign="top" height={36} />
                <Line
                  type="monotone"
                  dataKey="ventas_totales"
                  stroke="#d0ff009f"
                  strokeWidth={3}
                  name="Ventas Totales"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico 2: Margen vs Crecimiento */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              Margen vs Crecimiento de Clientes - {getTitulo()}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={dataConMesFormateado}
                margin={{ top: 20, right: 40, bottom: 50, left: 60 }}
              >
                <CartesianGrid stroke="white" strokeDasharray="3 3" />
                <XAxis
                  dataKey="mes_label"
                  label={{
                    value: "Mes",
                    position: "insideBottom",
                    offset: -25,
                    fill: "#ffffff",
                  }}
                  tick={{ fill: "#ffffff" }}
                />
                <YAxis
                  label={{
                    value: "%",
                    angle: -90,
                    position: "insideLeft",
                    offset: 0,
                    fill: "#ffffff",
                  }}
                  tick={{ fill: "#ffffff" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#000",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                  itemStyle={{ color: "#fff" }}
                  labelStyle={{ color: "#aaa" }}
                  cursor={{ stroke: "#888", strokeWidth: 1 }}
                />
                <Legend verticalAlign="top" height={36} />
                <Bar
                  dataKey="margen_ganancia_pct"
                  fill="#facc15"
                  name="Margen %"
                />
                <Bar
                  dataKey="tasa_crecimiento_clientes_pct"
                  fill="#8b5cf6"
                  name="Crec. Clientes %"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico 3: Precio Promedio */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              Precio Promedio Unitario - {getTitulo()}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={dataConMesFormateado}
                margin={{ top: 20, right: 40, bottom: 50, left: 60 }}
              >
                <CartesianGrid stroke="white" strokeDasharray="3 3" />
                <XAxis
                  dataKey="mes_label"
                  label={{
                    value: "Mes",
                    position: "insideBottom",
                    offset: -25,
                    fill: "#ffffff",
                  }}
                  tick={{ fill: "#ffffff" }}
                />
                <YAxis
                  label={{
                    value: "Precio ($)",
                    angle: -90,
                    position: "insideLeft",
                    offset: -25,
                    fill: "#ffffff",
                  }}
                  tick={{ fill: "#ffffff" }}
                />
                <Tooltip
                  formatter={(value) => `$${Number(value).toLocaleString()}`}
                  contentStyle={{
                    backgroundColor: "#000",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                  itemStyle={{ color: "#fff" }}
                  labelStyle={{ color: "#aaa" }}
                  cursor={{ stroke: "#888", strokeWidth: 1 }}
                />
                <Legend verticalAlign="top" height={36} />
                <Line
                  type="monotone"
                  dataKey="precio_promedio_unitario"
                  stroke="#d0ff009f"
                  strokeWidth={3}
                  name="Precio Promedio"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </>
    );
  };

  return (
    <div className="relative p-6 space-y-8 divSubMenuPpal">
      {/* Dropdown años */}
      <div className="fixed top-6 right-2.5 bg-gray-800 p-4 rounded-lg shadow-lg z-50 miCuadrado">
        <h4 className="text-white font-semibold mb-2">Filtrar por año</h4>
        <select
          id="yearSelect"
          name="year"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="select-custom"
        >
          <option value="todos">Todos</option>
          {availableYears.map((anio) => (
            <option key={anio} value={anio}>
              {anio}
            </option>
          ))}
        </select>
      </div>

      {/* Botones superiores */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate("/")}
          className="btnFlotante btnVolverMPpal px-4 py-2 bg-gray-700 hover:bg-gray-900 text-white rounded-lg shadow transition-all"
        >
          ⬅️ Volver
        </button>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 text-center">
        Panel de Ventas 💰 - {getTitulo()}
      </h2>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4" id="primerosDatos">
        <Card className="bg-blue-50">
          <CardContent className="p-4 text-center">
            <h3 className="text-sm font-medium text-gray-500">
              Ventas Totales
            </h3>
            <p className="text-xl font-bold text-blue-600">
              ${Number(ultimo.ventas_totales).toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-green-50">
          <CardContent className="p-4 text-center">
            <h3 className="text-sm font-medium text-gray-500">
              Unidades Vendidas
            </h3>
            <p className="text-xl font-bold text-green-600">
              {ultimo.unidades_vendidas}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-yellow-50">
          <CardContent className="p-4 text-center">
            <h3 className="text-sm font-medium text-gray-500">
              Margen de Ganancia
            </h3>
            <p className="text-xl font-bold text-yellow-600">
              {ultimo.margen_ganancia_pct}%
            </p>
          </CardContent>
        </Card>
        <Card className="bg-purple-50">
          <CardContent className="p-4 text-center">
            <h3 className="text-sm font-medium text-gray-500">
              Crecimiento de Clientes
            </h3>
            <p className="text-xl font-bold text-purple-600">
              {ultimo.tasa_crecimiento_clientes_pct}%
            </p>
          </CardContent>
        </Card>
        <Card className="bg-pink-50">
          <CardContent className="p-4 text-center">
            <h3 className="text-sm font-medium text-gray-500">
              Precio Promedio
            </h3>
            <p className="text-xl font-bold text-pink-600">
              ${ultimo.precio_promedio_unitario}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Mostrar cantidad de registros filtrados */}
      <div className="text-center text-white text-sm">
        Mostrando {dataFiltrada.length} registros
      </div>

      {/* Render gráficos */}
      {renderCharts()}
    </div>
  );
}
