SEGUIR ESTE ORDEN POR LAS DUDAS
SIEMPRE SI TIRA ERROR EMPEZAR POR ESTA LINEA
$env:DATABASE_URL="mysql://root:root@localhost:3306/sportmax"

npx prisma generate
npx prisma migrate dev --name init  
node prisma/seed.js   
npx prisma studio    

npx prisma migrate reset --force
PARA BORRAR TODA LA BD Y EMPEZAR DE 0

# 1. Generar el cliente de Prisma
npx prisma generate

# 2. Aplicar migraciones (si aún no lo hiciste)
npx prisma migrate dev --name init

# 3. Ejecutar el seed para insertar datos
node prisma/seed.js

# 4. Ver los KPIs calculados
node src/services/kpiService.js