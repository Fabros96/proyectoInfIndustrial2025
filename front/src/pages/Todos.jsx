import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
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

export default function DashboardCompleto() {
  const [data, setData] = useState([]);
  const [ventasData, setVentasData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedYears, setSelectedYears] = useState([]);

  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const resKpis = await fetch("http://localhost:3000/api/kpis/dashboard");
      const resultKpis = await resKpis.json();
      setData(resultKpis);

      const resVentas = await fetch("http://localhost:3000/api/kpis/ventas");
      const resultVentas = await resVentas.json();
      setVentasData(resultVentas);
      // Inicializamos los años disponibles y seleccionados (todos)
      const añosDisponibles = Array.from(
        new Set(resultKpis.map((d) => d.anio))
      );
      setSelectedYears(añosDisponibles);
    } catch (err) {
      console.error("Error al cargar datos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!data.length || !ventasData.length)
    return <p className="text-center mt-10">Cargando dashboard completo...</p>;

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

  const toggleYear = (year) => {
    setSelectedYears((prev) =>
      prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year]
    );
  };

  const dataConMesFormateado = data.map((item) => ({
    ...item,
    mes_label: formatMes(item.mes, item.anio),
  }));

  const ventasConMesFormateado = ventasData.map((item) => ({
    ...item,
    mes_label: formatMes(item.mes, item.anio),
  }));

  // CÁLCULOS VENTAS
  const ultimoVenta = ventasData[ventasData.length - 1];

  // CÁLCULOS PRODUCCIÓN
  const getDisponibilidadPorAnio = () => {
    const anios = {};
    data.forEach((item) => {
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
    if (data.length === 0) return [];
    const anioMasReciente = Math.max(...data.map((item) => item.anio));
    const datosAnioReciente = data.filter(
      (item) => item.anio === anioMasReciente
    );
    return datosAnioReciente.slice(-4).map((item) => ({
      mes_label: formatMes(item.mes, item.anio),
      costo: item.costo_unitario_produccion,
    }));
  };

  // CÁLCULOS CALIDAD
  const getFallasPorEquipo = () => {
    const equipos = {};
    data.forEach((item) => {
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
    data.forEach((item) => {
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

  // CÁLCULOS LOGÍSTICA
  const getNivelServicioPorAnio = () => {
    const anios = {};
    data.forEach((item) => {
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
    return data
      .filter((item) => item.tiempo_entrega_mes_dias > 4)
      .map((item) => ({
        mes_label: formatMes(item.mes, item.anio),
        tiempo_entrega: item.tiempo_entrega_mes_dias,
      }));
  };

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
  const ultimo = data[data.length - 1];
  const disponibilidadData = getDisponibilidadPorAnio();
  const costoUnitarioData = getCostoUnitarioPorMes();
  const fallasEquipoData = getFallasPorEquipo();
  const unidadesSinDefectosData = getUnidadesSinDefectosPorAnio();
  const nivelServicioData = getNivelServicioPorAnio();
  const tiemposEntregaMayores4 = getTiemposEntregaMayores4();

  return (
    <div className="relative p-6 space-y-12 divSubMenuPpal">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate("/")}
          className="btnFlotante btnVolverMPpal px-4 py-2 bg-gray-700 hover:bg-gray-900 text-white rounded-lg shadow transition-all"
        >
          ⬅️ Volver
        </button>
        <button
          onClick={fetchData}
          disabled={loading}
          className={`btnFlotante btnActualizar px-4 py-2 ${
            loading ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-800"
          } text-white rounded-lg shadow transition-all`}
        >
          🔄 {loading ? "Actualizando..." : "os"}
        </button>
      </div>
      {/* ==================== SECCIÓN VENTAS ==================== */}
      <div className="bg-white rounded-lg shadow-xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 text-center">TODOS</h2>
        <div className="border-b-4 border-green-500 pb-4 mb-6">
          <h2 className="text-3xl font-bold text-gray-800">💰 VENTAS</h2>
        </div>

        <div
          className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8"
          id="primerosDatos"
        >
          <div className="bg-blue-50 rounded-lg shadow p-4 text-center">
            <h3 className="text-sm font-medium text-gray-500">
              Ventas Totales
            </h3>
            <p className="text-xl font-bold text-blue-600">
              ${Number(ultimoVenta.ventas_totales).toLocaleString()}
            </p>
          </div>
          <div className="bg-green-50 rounded-lg shadow p-4 text-center">
            <h3 className="text-sm font-medium text-gray-500">
              Unidades Vendidas
            </h3>
            <p className="text-xl font-bold text-green-600">
              {ultimoVenta.unidades_vendidas}
            </p>
          </div>
          <div className="bg-yellow-50 rounded-lg shadow p-4 text-center">
            <h3 className="text-sm font-medium text-gray-500">
              Margen de Ganancia
            </h3>
            <p className="text-xl font-bold text-yellow-600">
              {ultimoVenta.margen_ganancia_pct}%
            </p>
          </div>
          <div className="bg-purple-50 rounded-lg shadow p-4 text-center">
            <h3 className="text-sm font-medium text-gray-500">
              Crec. Clientes
            </h3>
            <p className="text-xl font-bold text-purple-600">
              {ultimoVenta.tasa_crecimiento_clientes_pct}%
            </p>
          </div>
          <div className="bg-pink-50 rounded-lg shadow p-4 text-center">
            <h3 className="text-sm font-medium text-gray-500">
              Precio Promedio
            </h3>
            <p className="text-xl font-bold text-pink-600">
              ${ultimoVenta.precio_promedio_unitario}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              Evolución de Ventas Totales
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={ventasConMesFormateado}
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
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              Margen vs Crecimiento de Clientes
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={ventasConMesFormateado}
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
          </div>
        </div>
      </div>

      {/* ==================== SECCIÓN PRODUCCIÓN ==================== */}
      <div className="bg-white rounded-lg shadow-xl p-8">
        <div className="border-b-4 border-blue-500 pb-4 mb-6">
          <h2 className="text-3xl font-bold text-gray-800">📊 PRODUCCIÓN</h2>
        </div>

        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          id="primerosDatos"
        >
          <div className="bg-blue-50 rounded-lg shadow p-4 text-center">
            <h3 className="text-sm font-medium text-gray-500">
              Disponibilidad
            </h3>
            <p className="text-xl font-bold text-blue-600">
              {ultimo.disponibilidad_pct}%
            </p>
          </div>
          <div className="bg-green-50 rounded-lg shadow p-4 text-center">
            <h3 className="text-sm font-medium text-gray-500">
              Costo Unitario
            </h3>
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
              {ultimo.horas_produccion_mes}h
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              Disponibilidad por Año
            </h3>
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

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              Costo Unitario de Producción
            </h3>
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
        </div>
      </div>

      {/* ==================== SECCIÓN CALIDAD ==================== */}
      <div className="bg-white rounded-lg shadow-xl p-8">
        <div className="border-b-4 border-emerald-500 pb-4 mb-6">
          <h2 className="text-3xl font-bold text-gray-800">✅ CALIDAD</h2>
        </div>

        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          id="primerosDatos"
        >
          <div className="bg-emerald-50 rounded-lg shadow p-4 text-center">
            <h3 className="text-sm font-medium text-gray-500">
              % Sin Defectos
            </h3>
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
            <p className="text-xl font-bold text-rose-600">{data.length}</p>
          </div>
          <div className="bg-lime-50 rounded-lg shadow p-4 text-center">
            <h3 className="text-sm font-medium text-gray-500">
              Unidades Producidas
            </h3>
            <p className="text-xl font-bold text-lime-600">
              {ultimo.unidades_producidas.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              Fallas por Equipo
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

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              % Unidades sin Defectos por Año
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
                <Bar
                  dataKey="porcentaje"
                  fill="#00C49F"
                  name="% Sin Defectos"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ==================== SECCIÓN LOGÍSTICA ==================== */}
      <div className="bg-white rounded-lg shadow-xl p-8">
        <div className="border-b-4 border-purple-500 pb-4 mb-6">
          <h2 className="text-3xl font-bold text-gray-800">🚚 LOGÍSTICA</h2>
        </div>

        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          id="primerosDatos"
        >
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
              {ultimo.tiempo_entrega_mes_dias} días
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

        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              Nivel de Servicio por Año
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
                  dataKey="nivel_servicio"
                  fill="#8b5cf6"
                  name="Nivel de Servicio %"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              Tiempo de Entrega
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
                  dataKey="tiempo_entrega_mes_dias"
                  stroke="#d0ff009f"
                  strokeWidth={3}
                  name="Tiempo de Entrega"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white rounded-lg shadow p-4 text-center text-gray-600">
        <p className="text-sm">
          📅 Última actualización:{" "}
          {new Date().toLocaleDateString("es-ES", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
}
