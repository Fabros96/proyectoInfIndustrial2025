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
import { useNavigate } from "react-router-dom";

export default function Logistica() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCharts, setLoadingCharts] = useState(false);
  const [availableYears, setAvailableYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("todos");
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoadingCharts(true);
    try {
      const res = await fetch("http://localhost:3000/api/kpis/logistica");
      const result = await res.json();
      setData(result);

      if (!availableYears.length && result.length) {
        const años = Array.from(new Set(result.map((d) => d.anio))).sort();
        setAvailableYears(años);
      }
    } catch (err) {
      console.error("Error al cargar datos de logística:", err);
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
    return <p className="text-center mt-10">Cargando datos de logística...</p>;

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

  const getNivelServicioPorAnio = () => {
    const anios = {};
    dataFiltrada.forEach((item) => {
      if (!anios[item.anio]) {
        anios[item.anio] = { suma: 0, count: 0 };
      }
      anios[item.anio].suma += item.nivel_servicio_pct;
      anios[item.anio].count++;
    });

    return Object.keys(anios).map((anio) => ({
      anio: parseInt(anio),
      nivel_servicio: parseFloat(
        (anios[anio].suma / anios[anio].count).toFixed(2)
      ),
    }));
  };

  const getTiemposEntregaMayores4 = () => {
    return dataFiltrada
      .filter((item) => item.tiempo_entrega_dias > 4)
      .map((item) => ({
        mes_label: formatMes(item.mes, item.anio),
        tiempo_entrega: item.tiempo_entrega_dias,
      }));
  };

  const getTitulo = () => {
    if (selectedYear === "todos") {
      return "Todos los años";
    }
    return `Año ${selectedYear}`;
  };

  const ultimo = dataFiltrada[dataFiltrada.length - 1];
  const nivelServicioData = getNivelServicioPorAnio();
  const tiemposEntregaMayores4 = getTiemposEntregaMayores4();

  const renderCharts = () => {
    if (loadingCharts)
      return (
        <p className="text-center text-white text-lg mt-6">
          🔄 Cargando gráficos...
        </p>
      );

    return (
      <>
        {/* Gráfico 1: Nivel de Servicio por Año */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Nivel de Servicio por Año - {getTitulo()}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={nivelServicioData}
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
                  value: "Nivel de Servicio (%)",
                  angle: -90,
                  position: "insideLeft",
                  offset: -1,
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
              <Bar
                dataKey="nivel_servicio"
                fill="#8b5cf6"
                name="Nivel de Servicio %"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico 2: Tiempo de Entrega */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Evolución del Tiempo de Entrega - {getTitulo()}
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
                  value: "Días",
                  angle: -90,
                  position: "insideLeft",
                  offset: -25,
                  fill: "#ffffff",
                }}
                tick={{ fill: "#ffffff" }}
              />
              <Tooltip
                formatter={(value) => `${value} días`}
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
                dataKey="tiempo_entrega_dias"
                stroke="#d0ff009f"
                strokeWidth={3}
                name="Tiempo de Entrega"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico 3: Entregas con más de 4 días */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Entregas Mayores a 4 días - {getTitulo()}
          </h3>
          {tiemposEntregaMayores4.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={tiemposEntregaMayores4}
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
                    value: "Días",
                    angle: -90,
                    position: "insideLeft",
                    offset: -25,
                    fill: "#ffffff",
                  }}
                  tick={{ fill: "#ffffff" }}
                />
                <Tooltip
                  formatter={(value) => `${value} días`}
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
                  dataKey="tiempo_entrega"
                  fill="#ef4444"
                  name="Tiempo Entrega"
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 bg-green-50 rounded-lg border-2 border-green-200">
              <div className="text-center">
                <svg
                  className="w-16 h-16 mx-auto text-green-500 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-green-600 font-semibold text-lg">
                  ¡Excelente!
                </p>
                <p className="text-gray-600">
                  No hay entregas con más de 4 días
                </p>
              </div>
            </div>
          )}
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
        Panel de Logística 🚚 - {getTitulo()}
      </h2>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4" id="primerosDatos">
        <div className="bg-purple-50 rounded-lg shadow p-4 text-center">
          <h3 className="text-sm font-medium text-gray-500">
            Nivel de Servicio
          </h3>
          <p className="text-xl font-bold text-purple-600">
            {ultimo.nivel_servicio_pct}%
          </p>
        </div>
        <div className="bg-orange-50 rounded-lg shadow p-4 text-center">
          <h3 className="text-sm font-medium text-gray-500">
            Tiempo de Entrega
          </h3>
          <p className="text-xl font-bold text-orange-600">
            {ultimo.tiempo_entrega_dias} días
          </p>
        </div>
        <div className="bg-red-50 rounded-lg shadow p-4 text-center">
          <h3 className="text-sm font-medium text-gray-500">
            Entregas +4 días
          </h3>
          <p className="text-xl font-bold text-red-600">
            {tiemposEntregaMayores4.length}
          </p>
        </div>
        <div className="bg-teal-50 rounded-lg shadow p-4 text-center">
          <h3 className="text-sm font-medium text-gray-500">
            Pedidos en Tiempo
          </h3>
          <p className="text-xl font-bold text-teal-600">
            {Math.round(ultimo.nivel_servicio_pct)}%
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
