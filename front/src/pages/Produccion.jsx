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
import { useNavigate } from "react-router-dom";

export default function Produccion() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCharts, setLoadingCharts] = useState(false);
  const [availableYears, setAvailableYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("todos");
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoadingCharts(true);
    try {
      const res = await fetch("http://localhost:3000/api/kpis/produccion");
      const result = await res.json();
      setData(result);
      if (!loading) console.log(JSON.stringify(result, null, 2));
      if (!availableYears.length && result.length) {
        const años = Array.from(new Set(result.map((d) => d.anio))).sort();
        setAvailableYears(años);
      }
    } catch (err) {
      console.error("Error al cargar datos de producción:", err);
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
    return <p className="text-center mt-10">Cargando datos de producción...</p>;

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

  const getDisponibilidadPorAnio = () => {
    const anios = {};
    dataFiltrada.forEach((item) => {
      if (!anios[item.anio]) {
        anios[item.anio] = { suma: 0, count: 0 };
      }
      anios[item.anio].suma += item.disponibilidad_pct;
      anios[item.anio].count++;
    });

    return Object.keys(anios).map((anio) => ({
      anio: parseInt(anio),
      disponibilidad_pct: parseFloat(
        (anios[anio].suma / anios[anio].count).toFixed(2)
      ),
    }));
  };

  const getCostoUnitarioPorMes = () => {
    if (dataFiltrada.length === 0) return [];

    if (selectedYear === "todos") {
      const anioMasReciente = Math.max(
        ...dataFiltrada.map((item) => item.anio)
      );
      const datosAnioReciente = dataFiltrada.filter(
        (item) => item.anio === anioMasReciente
      );
      return datosAnioReciente.slice(-4).map((item) => ({
        mes_label: formatMes(item.mes, item.anio),
        costo: item.costo_unitario_produccion,
      }));
    } else {
      return dataFiltrada.slice(-4).map((item) => ({
        mes_label: formatMes(item.mes, item.anio),
        costo: item.costo_unitario_produccion,
      }));
    }
  };

  const getTitulo = () => {
    if (selectedYear === "todos") {
      return "Todos los años";
    }
    return `Año ${selectedYear}`;
  };

  const ultimo = dataFiltrada[dataFiltrada.length - 1];
  const disponibilidadData = getDisponibilidadPorAnio();
  const costoUnitarioData = getCostoUnitarioPorMes();

  const renderCharts = () => {
    if (loadingCharts)
      return (
        <p className="text-center text-white text-lg mt-6">
          🔄 Cargando gráficos...
        </p>
      );

    return (
      <>
        {/* Gráfico 1: Disponibilidad por Año */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Disponibilidad por Año - {getTitulo()}
          </h3>
          <p className="text-sm text-gray-600 mb-4 italic">
            (Horas de Producción - Horas Improductivas) / Horas de Producción
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={disponibilidadData}
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
                  value: "Disponibilidad (%)",
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
              <Bar
                dataKey="disponibilidad_pct"
                fill="#0088FE"
                name="Disponibilidad %"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico 2: Costo Unitario de Producción */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Costo Unitario de Producción - {getTitulo()}
          </h3>
          <p className="text-sm text-gray-600 mb-4 italic">
            Costo Total de Producción / Unidades Producidas
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={costoUnitarioData}
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
                  value: "Costo ($)",
                  angle: -90,
                  position: "insideLeft",
                  offset: -25,
                  fill: "#ffffff",
                }}
                tick={{ fill: "#ffffff" }}
              />
              <Tooltip
                formatter={(value) => `$${value}`}
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
                dataKey="costo"
                stroke="#d0ff009f"
                strokeWidth={3}
                name="Costo ($)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico 3: Unidades Producidas */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Evolución de Unidades Producidas - {getTitulo()}
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
              <Line
                type="monotone"
                dataKey="unidades_producidas"
                stroke="#d0ff009f"
                strokeWidth={3}
                name="Unidades Producidas"
              />
            </LineChart>
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
        Panel de Producción 📊 - {getTitulo()}
      </h2>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4" id="primerosDatos">
        <div className="bg-blue-50 rounded-lg shadow p-4 text-center">
          <h3 className="text-sm font-medium text-gray-500">Disponibilidad</h3>
          <p className="text-xl font-bold text-blue-600">
            {ultimo.disponibilidad_pct}%
          </p>
        </div>
        <div className="bg-green-50 rounded-lg shadow p-4 text-center">
          <h3 className="text-sm font-medium text-gray-500">Costo Unitario</h3>
          <p className="text-xl font-bold text-green-600">
            ${ultimo.costo_unitario_produccion}
          </p>
        </div>
        <div className="bg-indigo-50 rounded-lg shadow p-4 text-center">
          <h3 className="text-sm font-medium text-gray-500">
            Unidades Producidas
          </h3>
          <p className="text-xl font-bold text-indigo-600">
            {ultimo.unidades_producidas.toLocaleString()}
          </p>
        </div>
        <div className="bg-cyan-50 rounded-lg shadow p-4 text-center">
          <h3 className="text-sm font-medium text-gray-500">
            Horas Producción
          </h3>
          <p className="text-xl font-bold text-cyan-600">
            {ultimo.horas_produccion}h
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
