const { PrismaClient } = require("../../generated/prisma");
const prisma = new PrismaClient();

/**
 * Obtiene el dashboard completo de KPIs
 * Equivalente a: SELECT * FROM dashboard_kpis
 */
async function getDashboardKPIs() {
  try {
    const resultado = await prisma.tiempo.findMany({
      include: {
        produccion: true,
        ventas: true,
        calidad: true,
        logistica: true,
      },
      orderBy: [{ anio: "asc" }, { mes: "asc" }],
    });

    const dashboardKPIs = resultado.map((tiempo) => {
      const prod = tiempo.produccion[0] || {};
      const venta = tiempo.ventas[0] || {};
      const cal = tiempo.calidad[0] || {};
      const log = tiempo.logistica[0] || {};

      // PRODUCCIÓN
      const disponibilidad_pct = prod.horas_produccion
        ? parseFloat(
            (
              ((prod.horas_produccion - prod.horas_improductivas) /
                prod.horas_produccion) *
              100
            ).toFixed(2)
          )
        : null;

      const costo_unitario_produccion = prod.unidades_producidas
        ? parseFloat(
            (prod.costo_total_produccion / prod.unidades_producidas).toFixed(2)
          )
        : null;

      // CALIDAD
      const pct_unidades_sin_defectos = prod.unidades_producidas
        ? parseFloat(
            (
              (prod.unidades_sin_defectos / prod.unidades_producidas) *
              100
            ).toFixed(2)
          )
        : null;

      const pct_productos_no_conformes = cal.productos_inspeccionados
        ? parseFloat(
            (
              (cal.productos_no_conformes / cal.productos_inspeccionados) *
              100
            ).toFixed(2)
          )
        : null;

      const tiempo_promedio_resolucion_hrs = cal.reclamos_recibidos
        ? parseFloat(
            (cal.tiempo_resolucion_horas / cal.reclamos_recibidos).toFixed(2)
          )
        : null;

      // LOGÍSTICA
      const nivel_servicio_pct = log.total_pedidos
        ? parseFloat(
            (
              (log.pedidos_entregados_a_tiempo / log.total_pedidos) *
              100
            ).toFixed(2)
          )
        : null;

      const costo_logistico_por_unidad = log.unidades_enviadas
        ? parseFloat(
            (log.costo_logistico_total / log.unidades_enviadas).toFixed(2)
          )
        : null;

      // VENTAS
      const margen_ganancia_pct = venta.ventas_totales
        ? parseFloat(
            (
              ((venta.ventas_totales - venta.costo_ventas) /
                venta.ventas_totales) *
              100
            ).toFixed(2)
          )
        : null;

      const precio_promedio_unitario = venta.unidades_vendidas
        ? parseFloat(
            (venta.ventas_totales / venta.unidades_vendidas).toFixed(2)
          )
        : null;

      const tasa_crecimiento_clientes_pct = venta.clientes_activos
        ? parseFloat(
            ((venta.nuevos_clientes / venta.clientes_activos) * 100).toFixed(2)
          )
        : null;

      const ventas_por_cliente_activo = venta.clientes_activos
        ? parseFloat((venta.ventas_totales / venta.clientes_activos).toFixed(2))
        : null;

      return {
        anio: tiempo.anio,
        mes: tiempo.mes,
        // PRODUCCIÓN
        disponibilidad_pct,
        costo_unitario_produccion,
        unidades_producidas: prod.unidades_producidas,
        equipo_con_fallas: prod.equipo_con_fallas,
        // CALIDAD
        pct_unidades_sin_defectos,
        pct_productos_no_conformes,
        tiempo_promedio_resolucion_hrs,
        // LOGÍSTICA
        nivel_servicio_pct,
        tiempo_entrega_mes_dias: log.tiempo_entrega_dias,
        costo_logistico_por_unidad,
        // VENTAS
        ventas_totales: venta.ventas_totales,
        margen_ganancia_pct,
        precio_promedio_unitario,
        tasa_crecimiento_clientes_pct,
        ventas_por_cliente_activo,
      };
    });

    return dashboardKPIs;
  } catch (error) {
    console.error("Error al obtener dashboard KPIs:", error);
    throw error;
  }
}

/**
 * Obtiene KPIs de Producción
 */
async function getKPIProduccion() {
  try {
    const resultado = await prisma.tiempo.findMany({
      include: {
        produccion: true,
      },
      orderBy: [{ anio: "asc" }, { mes: "asc" }],
    });

    return resultado.map((tiempo) => {
      const prod = tiempo.produccion[0] || {};

      return {
        anio: tiempo.anio,
        mes: tiempo.mes,
        horas_produccion: prod.horas_produccion,
        horas_improductivas: prod.horas_improductivas,
        disponibilidad_pct: prod.horas_produccion
          ? parseFloat(
              (
                ((prod.horas_produccion - prod.horas_improductivas) /
                  prod.horas_produccion) *
                100
              ).toFixed(2)
            )
          : null,
        costo_unitario_produccion: prod.unidades_producidas
          ? parseFloat(
              (prod.costo_total_produccion / prod.unidades_producidas).toFixed(
                2
              )
            )
          : null,
        unidades_producidas: prod.unidades_producidas,
        equipo_con_fallas: prod.equipo_con_fallas,
      };
    });
  } catch (error) {
    console.error("Error al obtener KPI Producción:", error);
    throw error;
  }
}

/**
 * Obtiene KPIs de Calidad
 */
async function getKPICalidad() {
  try {
    const resultado = await prisma.tiempo.findMany({
      include: {
        produccion: true,
        calidad: true,
      },
      orderBy: [{ anio: "asc" }, { mes: "asc" }],
    });

    return resultado.map((tiempo) => {
      const prod = tiempo.produccion[0] || {};
      const cal = tiempo.calidad[0] || {};

      return {
        anio: tiempo.anio,
        mes: tiempo.mes,
        equipo_con_fallas: prod.equipo_con_fallas,
        unidades_producidas: prod.unidades_producidas,
        pct_unidades_sin_defectos: prod.unidades_producidas
          ? parseFloat(
              (
                (prod.unidades_sin_defectos / prod.unidades_producidas) *
                100
              ).toFixed(2)
            )
          : null,
        pct_productos_no_conformes: cal.productos_inspeccionados
          ? parseFloat(
              (
                (cal.productos_no_conformes / cal.productos_inspeccionados) *
                100
              ).toFixed(2)
            )
          : null,
        tiempo_promedio_resolucion_hrs: cal.reclamos_recibidos
          ? parseFloat(
              (cal.tiempo_resolucion_horas / cal.reclamos_recibidos).toFixed(2)
            )
          : null,
      };
    });
  } catch (error) {
    console.error("Error al obtener KPI Calidad:", error);
    throw error;
  }
}

/**
 * Obtiene KPIs de Logística
 */
async function getKPILogistica() {
  try {
    const resultado = await prisma.tiempo.findMany({
      include: {
        logistica: true,
      },
      orderBy: [{ anio: "asc" }, { mes: "asc" }],
    });

    return resultado.map((tiempo) => {
      const log = tiempo.logistica[0] || {};

      return {
        anio: tiempo.anio,
        mes: tiempo.mes,
        total_pedidos: log.total_pedidos,
        pedidos_entregados_a_tiempo: log.pedidos_entregados_a_tiempo,
        nivel_servicio_pct: log.total_pedidos
          ? parseFloat(
              (
                (log.pedidos_entregados_a_tiempo / log.total_pedidos) *
                100
              ).toFixed(2)
            )
          : null,
        tiempo_entrega_dias: log.tiempo_entrega_dias,
        costo_logistico_por_unidad: log.unidades_enviadas
          ? parseFloat(
              (log.costo_logistico_total / log.unidades_enviadas).toFixed(2)
            )
          : null,
      };
    });
  } catch (error) {
    console.error("Error al obtener KPI Logística:", error);
    throw error;
  }
}

/**
 * Obtiene KPIs de Ventas
 */
async function getKPIVentas() {
  try {
    const resultado = await prisma.tiempo.findMany({
      include: {
        ventas: true,
      },
      orderBy: [{ anio: "asc" }, { mes: "asc" }],
    });

    return resultado.map((tiempo) => {
      const venta = tiempo.ventas[0] || {};

      return {
        anio: tiempo.anio,
        mes: tiempo.mes,
        ventas_totales: venta.ventas_totales,
        unidades_vendidas: venta.unidades_vendidas,
        margen_ganancia_pct: venta.ventas_totales
          ? parseFloat(
              (
                ((venta.ventas_totales - venta.costo_ventas) /
                  venta.ventas_totales) *
                100
              ).toFixed(2)
            )
          : null,
        precio_promedio_unitario: venta.unidades_vendidas
          ? parseFloat(
              (venta.ventas_totales / venta.unidades_vendidas).toFixed(2)
            )
          : null,
        tasa_crecimiento_clientes_pct: venta.clientes_activos
          ? parseFloat(
              ((venta.nuevos_clientes / venta.clientes_activos) * 100).toFixed(
                2
              )
            )
          : null,
        ventas_por_cliente_activo: venta.clientes_activos
          ? parseFloat(
              (venta.ventas_totales / venta.clientes_activos).toFixed(2)
            )
          : null,
      };
    });
  } catch (error) {
    console.error("Error al obtener KPI Ventas:", error);
    throw error;
  }
}

/**
 * Obtiene resumen de fallas por equipo
 */
async function getResumenFallasPorEquipo() {
  try {
    const producciones = await prisma.produccion.findMany();

    // Agrupar por equipo
    const resumen = {};

    producciones.forEach((prod) => {
      if (!resumen[prod.equipo_con_fallas]) {
        resumen[prod.equipo_con_fallas] = {
          equipo_con_fallas: prod.equipo_con_fallas,
          total_fallas: 0,
          suma_horas_improductivas: 0,
          suma_pct_sin_defectos: 0,
        };
      }

      resumen[prod.equipo_con_fallas].total_fallas++;
      resumen[prod.equipo_con_fallas].suma_horas_improductivas +=
        prod.horas_improductivas;
      resumen[prod.equipo_con_fallas].suma_pct_sin_defectos +=
        (prod.unidades_sin_defectos / prod.unidades_producidas) * 100;
    });

    // Calcular promedios y formatear
    return Object.values(resumen)
      .map((item) => ({
        equipo_con_fallas: item.equipo_con_fallas,
        total_fallas: item.total_fallas,
        promedio_horas_improductivas: parseFloat(
          (item.suma_horas_improductivas / item.total_fallas).toFixed(2)
        ),
        promedio_pct_sin_defectos: parseFloat(
          (item.suma_pct_sin_defectos / item.total_fallas).toFixed(2)
        ),
      }))
      .sort((a, b) => b.total_fallas - a.total_fallas);
  } catch (error) {
    console.error("Error al obtener resumen de fallas:", error);
    throw error;
  }
}

// Exportar funciones
module.exports = {
  getDashboardKPIs,
  getKPIProduccion,
  getKPICalidad,
  getKPILogistica,
  getKPIVentas,
  getResumenFallasPorEquipo,
};

// Si se ejecuta directamente
if (require.main === module) {
  (async () => {
    try {
      console.log("\n📊 DASHBOARD KPIs COMPLETO:");
      const dashboard = await getDashboardKPIs();
      console.table(dashboard);

      console.log("\n⚠️ RESUMEN FALLAS POR EQUIPO:");
      const fallas = await getResumenFallasPorEquipo();
      console.table(fallas);
    } catch (error) {
      console.error("Error:", error);
      process.exit(1);
    } finally {
      await prisma.$disconnect();
    }
  })();
}
