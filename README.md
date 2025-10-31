# proyectoInfIndustrial2025
INSTRUCCIONES:
Abrir 2 ventanas de Visual Studio Code. 1 para ejecutar el Back y la otra para el Front

Leer el README del Back
------------------BACK--------------------
Abrir terminal en carpeta 'Back'
Ejecutar los siguientes comandos en este orden

npm install

(Esta es por si tira error de que no reconoce $env:DATABASE_URL)
$env:DATABASE_URL="mysql://root:root@localhost:3306/sportmax"

npx prisma generate
npx prisma migrate dev --name init (puede ser el nombre que quieras no necesariamente init //opcional) 
node prisma/seed.js   (para llenar las tablas de datos)
npx prisma studio    (esto es para ver las tablas en el navegador //opcional)

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

npm run dev <--Ultimo y si todo sale bien debemos ver un mensaje de que se esta ejecutando en un puerto (3000)
-----------------/BACK--------------------

-----------------FRONT--------------------
Abrir terminal en carpeta 'Front'
Ejecutar los siguientes comandos en este orden

npm install

npm run dev

Y listo!! Ya deberias poder hacer click en el enlace de
  ➜  Local:   http://localhost:5173/ e ir al proyecto
-----------------/FRONT-------------------

La 2da vez que quiera ejecutar todo solamente pone 'npm run dev' en ambas carpetas.