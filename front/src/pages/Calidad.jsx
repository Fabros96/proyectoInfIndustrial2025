/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";

export default function Calidad() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCharts, setLoadingCharts] = useState(false);
  const [availableYears, setAvailableYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("todos");
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoadingCharts(true);
    try {
      const res = await fetch("http://localhost:3000/api/kpis/calidad");
      const result = await res.json();
      setData(result);
      if (!loading) console.log(JSON.stringify(result, null, 2));

      if (!availableYears.length && result.length) {
        const años = Array.from(new Set(result.map((d) => d.anio))).sort();
        setAvailableYears(años);
      }
    } catch (err) {
      console.error("Error al cargar datos de calidad:", err);
    } finally {
      setLoadingCharts(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchData().finally(() => setLoading(false));
  }, []);

  const dataFiltrada =
    selectedYear === "todos"
      ? data
      : data.filter((item) => item.anio === parseInt(selectedYear));

  if (!data.length)
    return <p className="text-center mt-10">Cargando datos de calidad...</p>;

  const getFallasPorEquipo = () => {
    const equipos = {};
    dataFiltrada.forEach((item) => {
      if (!equipos[item.equipo_con_fallas]) {
        equipos[item.equipo_con_fallas] = 0;
      }
      equipos[item.equipo_con_fallas]++;
    });

    const total = Object.values(equipos).reduce((sum, val) => sum + val, 0);

    return Object.keys(equipos).map((equipo) => ({
      equipo,
      fallas: equipos[equipo],
      porcentaje: parseFloat(((equipos[equipo] / total) * 100).toFixed(2)),
    }));
  };

  const getUnidadesSinDefectosPorAnio = () => {
    const anios = {};
    dataFiltrada.forEach((item) => {
      if (!anios[item.anio]) {
        anios[item.anio] = {
          suma_sin_defectos: 0,
          suma_producidas: 0,
        };
      }
      const unidades_sin_defectos =
        item.unidades_producidas * (item.pct_unidades_sin_defectos / 100);
      anios[item.anio].suma_sin_defectos += unidades_sin_defectos;
      anios[item.anio].suma_producidas += item.unidades_producidas;
    });

    return Object.keys(anios).map((anio) => ({
      anio: parseInt(anio),
      porcentaje: parseFloat(
        (
          (anios[anio].suma_sin_defectos / anios[anio].suma_producidas) *
          100
        ).toFixed(2)
      ),
      unidades_sin_defectos: Math.round(anios[anio].suma_sin_defectos),
      unidades_producidas: Math.round(anios[anio].suma_producidas),
    }));
  };

  const getTitulo = () => {
    if (selectedYear === "todos") {
      return "Todos los años";
    }
    return `Año ${selectedYear}`;
  };

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
  const ultimo = dataFiltrada[dataFiltrada.length - 1];
  const fallasEquipoData = getFallasPorEquipo();
  const unidadesSinDefectosData = getUnidadesSinDefectosPorAnio();

  const renderCharts = () => {
    if (loadingCharts)
      return (
        <p className="text-center text-white text-lg mt-6">
          🔄 Cargando gráficos...
        </p>
      );

    return (
      <>
        {/* Gráfico 1: Fallas por Equipo (Pie) */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Cantidad de Fallas por Equipo - {getTitulo()}
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={fallasEquipoData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ equipo, porcentaje }) =>
                    `${equipo}: ${porcentaje}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="fallas"
                >
                  {fallasEquipoData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#000",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                  itemStyle={{ color: "#fff" }}
                  labelStyle={{ color: "#aaa" }}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="space-y-2 px-[35%]">
              {fallasEquipoData.map((item, index) => (
                <div
                  key={item.equipo}
                  className="flex justify-between items-center p-3 rounded"
                  style={{
                    backgroundColor: `${COLORS[index % COLORS.length]}20`,
                  }}
                >
                  <div>
                    <span className="font-semibold text-gray-700">
                      {item.equipo}
                    </span>
                    <span className="text-xs text-gray-500 ml-2">
                      ({item.porcentaje}%)
                    </span>
                  </div>
                  <span
                    className="font-bold text-lg"
                    style={{ color: COLORS[index % COLORS.length] }}
                  >
                    {item.fallas}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Gráfico 2: % Unidades sin defectos por año */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            % Unidades Producidas sin Defectos - {getTitulo()}
          </h3>
          <p className="text-sm text-gray-600 mb-4 italic">
            Unidades sin defectos / Unidades Producidas
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={unidadesSinDefectosData}
              margin={{ top: 20, right: 40, bottom: 50, left: 60 }}
            >
              <CartesianGrid stroke="white" strokeDasharray="3 3" />
              <XAxis
                dataKey="anio"
                label={{
                  value: "Año",
                  position: "insideBottom",
                  offset: -25,
                  fill: "#ffffff",
                }}
                tick={{ fill: "#ffffff" }}
              />
              <YAxis
                domain={[0, 100]}
                label={{
                  value: "% Sin Defectos",
                  angle: -90,
                  position: "insideLeft",
                  offset: -25,
                  fill: "#ffffff",
                }}
                tick={{ fill: "#ffffff" }}
              />
              <Tooltip
                formatter={(value) => `${value}%`}
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
              <Bar dataKey="porcentaje" fill="#00C49F" name="% Sin Defectos" />
            </BarChart>
          </ResponsiveContainer>

          <div className="mt-4 space-y-2" id="primerosDatos2">
            {unidadesSinDefectosData.map((item) => (
              <div key={item.anio} className="p-3 bg-green-50 rounded">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-gray-700">
                    Año {item.anio}
                  </span>
                  <span className="text-green-600 font-bold text-lg">
                    {item.porcentaje}%
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  {item.unidades_sin_defectos} /{" "}
                  {item.unidades_producidas} unidades
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gráfico 3: Tendencia de defectos */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Comparativa de Años - Calidad - {getTitulo()}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={unidadesSinDefectosData}
              margin={{ top: 20, right: 40, bottom: 50, left: 60 }}
            >
              <CartesianGrid stroke="white" strokeDasharray="3 3" />
              <XAxis
                dataKey="anio"
                label={{
                  value: "Año",
                  position: "insideBottom",
                  offset: -25,
                  fill: "#ffffff",
                }}
                tick={{ fill: "#ffffff" }}
              />
              <YAxis
                label={{
                  value: "Unidades",
                  angle: -90,
                  position: "insideLeft",
                  offset: -25,
                  fill: "#ffffff",
                }}
                tick={{ fill: "#ffffff" }}
              />
              <Tooltip
                formatter={(value) => value.toLocaleString()}
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
                dataKey="unidades_sin_defectos"
                fill="#10b981"
                name="Sin Defectos"
              />
              <Bar
                dataKey={(item) =>
                  item.unidades_producidas - item.unidades_sin_defectos
                }
                fill="#ef4444"
                name="Con Defectos"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
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
        Panel de Calidad ✅ - {getTitulo()}
      </h2>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4" id="primerosDatos">
        <div className="bg-emerald-50 rounded-lg shadow p-4 text-center">
          <h3 className="text-sm font-medium text-gray-500">% Sin Defectos</h3>
          <p className="text-xl font-bold text-emerald-600">
            {ultimo.pct_unidades_sin_defectos}%
          </p>
        </div>
        <div className="bg-amber-50 rounded-lg shadow p-4 text-center">
          <h3 className="text-sm font-medium text-gray-500">
            Equipo con Fallas
          </h3>
          <p className="text-xl font-bold text-amber-600">
            {ultimo.equipo_con_fallas}
          </p>
        </div>
        <div className="bg-rose-50 rounded-lg shadow p-4 text-center">
          <h3 className="text-sm font-medium text-gray-500">Total Fallas</h3>
          <p className="text-xl font-bold text-rose-600">
            {dataFiltrada.length}
          </p>
        </div>
        <div className="bg-lime-50 rounded-lg shadow p-4 text-center">
          <h3 className="text-sm font-medium text-gray-500">
            Unidades Producidas
          </h3>
          <p className="text-xl font-bold text-lime-600">
            {ultimo.unidades_producidas}
          </p>
        </div>
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
