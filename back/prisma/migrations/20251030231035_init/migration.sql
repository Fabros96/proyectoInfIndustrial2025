/*
  Warnings:

  - You are about to drop the `venta` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `venta` DROP FOREIGN KEY `Venta_id_tiempo_fkey`;

-- DropTable
DROP TABLE `venta`;

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

-- AddForeignKey
ALTER TABLE `Ventas` ADD CONSTRAINT `Ventas_id_tiempo_fkey` FOREIGN KEY (`id_tiempo`) REFERENCES `Tiempo`(`id_tiempo`) ON DELETE CASCADE ON UPDATE CASCADE;
