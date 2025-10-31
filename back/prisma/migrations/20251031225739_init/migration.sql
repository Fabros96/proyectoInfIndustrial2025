-- CreateTable
CREATE TABLE `Tiempo` (
    `id_tiempo` INTEGER NOT NULL AUTO_INCREMENT,
    `anio` INTEGER NOT NULL,
    `mes` INTEGER NOT NULL,

    PRIMARY KEY (`id_tiempo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Produccion` (
    `id_produccion` INTEGER NOT NULL AUTO_INCREMENT,
    `id_tiempo` INTEGER NOT NULL,
    `horas_produccion` DECIMAL(10, 2) NOT NULL,
    `horas_improductivas` DECIMAL(10, 2) NOT NULL,
    `costo_total_produccion` DECIMAL(12, 2) NOT NULL,
    `unidades_producidas` INTEGER NOT NULL,
    `unidades_sin_defectos` INTEGER NOT NULL,
    `equipo_con_fallas` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`id_produccion`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Ventas` (
    `id_venta` INTEGER NOT NULL AUTO_INCREMENT,
    `id_tiempo` INTEGER NOT NULL,
    `ventas_totales` DECIMAL(12, 2) NOT NULL,
    `unidades_vendidas` INTEGER NOT NULL,
    `costo_ventas` DECIMAL(12, 2) NOT NULL,
    `nuevos_clientes` INTEGER NOT NULL,
    `clientes_activos` INTEGER NOT NULL,

    PRIMARY KEY (`id_venta`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Calidad` (
    `id_calidad` INTEGER NOT NULL AUTO_INCREMENT,
    `id_tiempo` INTEGER NOT NULL,
    `productos_inspeccionados` INTEGER NOT NULL,
    `productos_no_conformes` INTEGER NOT NULL,
    `reclamos_recibidos` INTEGER NOT NULL,
    `tiempo_resolucion_horas` DECIMAL(10, 2) NOT NULL,

    PRIMARY KEY (`id_calidad`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Logistica` (
    `id_logistica` INTEGER NOT NULL AUTO_INCREMENT,
    `id_tiempo` INTEGER NOT NULL,
    `total_pedidos` INTEGER NOT NULL,
    `pedidos_entregados_a_tiempo` INTEGER NOT NULL,
    `tiempo_entrega_dias` DECIMAL(10, 2) NOT NULL,
    `costo_logistico_total` DECIMAL(12, 2) NOT NULL,
    `unidades_enviadas` INTEGER NOT NULL,

    PRIMARY KEY (`id_logistica`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Produccion` ADD CONSTRAINT `Produccion_id_tiempo_fkey` FOREIGN KEY (`id_tiempo`) REFERENCES `Tiempo`(`id_tiempo`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ventas` ADD CONSTRAINT `Ventas_id_tiempo_fkey` FOREIGN KEY (`id_tiempo`) REFERENCES `Tiempo`(`id_tiempo`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Calidad` ADD CONSTRAINT `Calidad_id_tiempo_fkey` FOREIGN KEY (`id_tiempo`) REFERENCES `Tiempo`(`id_tiempo`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Logistica` ADD CONSTRAINT `Logistica_id_tiempo_fkey` FOREIGN KEY (`id_tiempo`) REFERENCES `Tiempo`(`id_tiempo`) ON DELETE CASCADE ON UPDATE CASCADE;
