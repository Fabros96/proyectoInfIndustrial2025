# proyectoInfIndustrial2025 -- SPORTMAX
INSTRUCCIONES:
Abrir 2 ventanas de Visual Studio Code. 1 para ejecutar el Back y la otra para el Front

# SportMax Backend

API REST para gestión de un tablero de control de una tienda deportiva con sistema de ventas, inventario y análisis de KPIs.

## 🛠️ Tecnologías Utilizadas

- **Node.js** - Entorno de ejecución
- **Express.js** - Framework web
- **Prisma ORM** - Object-Relational Mapping
- **MySQL** - Base de datos relacional
- **JavaScript** - Lenguaje de programación

---

## 📋 Requisitos Previos !!!Importante!!!

Antes de comenzar, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (v16 o superior)
- [MySQL](https://dev.mysql.com/downloads/installer/) (v8.0 o superior)
- Un editor de código (VS Code recomendado)

---

## 🚀 Configuración Inicial (Primera Vez)

### 1. Clonar o descargar el proyecto

Abrir la terminal en la raiz del proyecto ejecutar el siguiente comando:

```bash
cd ./back
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Abrir la terminal(carpeta back) ejecutar el siguiente comando:

```bash
$env:DATABASE_URL="mysql://root:root@localhost:3306/sportmax"
```

> **Nota:** Ajusta `root:root` con tu usuario y contraseña de MySQL

### 4. Configurar la base de datos

```bash
# Generar el cliente de Prisma
npx prisma generate

# Crear la base de datos y aplicar migraciones
npx prisma migrate dev --name init

# (Opcional) Cargar datos de prueba
node prisma/seed.js
```

### 5. Levantar el servidor

```bash
npm start
o
npm run dev
```

El servidor estará corriendo en `http://localhost:3000`

---

## 🔄 Levantar el Backend (Siguientes Veces)

Si ya completaste la configuración inicial, solo necesitas:

```bash
npm start
o
npm run dev
```
Si por alguna razon aparece algun error relacionado a la variable de entorno `DATABASE_URL` o al archivo .env
Ejecutar en la consola:
```bash
$env:DATABASE_URL="mysql://root:root@localhost:3306/sportmax"
```
Y luego seguir el flujo normal


---

## 🗑️ Casos Especiales

### Borrar TODO y empezar de cero

```bash
# CUIDADO: Esto elimina todos los datos
npx prisma migrate reset --force
```

Este comando:

- Borra toda la base de datos
- Reaplica todas las migraciones
- Ejecuta el seed automáticamente

### Después de cambios en el schema

Si modificaste el archivo `prisma/schema.prisma`:

```bash
# Generar nuevo cliente
npx prisma generate

# Crear nueva migración
npx prisma migrate dev --name nombre_del_cambio
```

### Ver y editar datos visualmente

```bash
npx prisma studio
```

Abre una interfaz web en `http://localhost:5555`

### Ejecutar cálculo de KPIs

```bash
node src/services/kpiService.js
```

---

## 📁 Estructura del Proyecto

```
BACK/
├── prisma/
│   ├── schema.prisma      # Definición de la base de datos
│   ├── seed.js            # Datos iniciales
│   └── migrations/        # Historial de migraciones
├── src/
│   ├── routes/            # Rutas de la API
│   ├── controllers/       # Lógica de negocio
│   ├── services/          # Servicios (KPIs, etc.)
│   └── index.js           # Punto de entrada
├── .env                   # Variables de entorno
├── package.json           # Dependencias del proyecto
└── README.md              # Este archivo
```

---

## 🔧 Scripts Disponibles

```bash
npm start              # Inicia el servidor
npm run dev            # Inicia con nodemon (auto-reload)
npx prisma studio      # Abre el editor visual de BD
npx prisma generate    # Regenera el cliente de Prisma
node prisma/seed.js    # Carga datos de prueba
```

---

## 🐛 Solución de Problemas

### Error: "Cannot connect to MySQL server"

- Verifica que MySQL esté corriendo
- Confirma usuario y contraseña en `.env`
- Verifica que el puerto sea `3306`

### Error: "prisma command not found"

```bash
npm install
npx prisma generate
```

### Error: "Table doesn't exist"

```bash
npx prisma migrate dev --name init
```

### La base de datos tiene datos corruptos

```bash
npx prisma migrate reset --force
```

---

## 📝 Endpoints de la API

Una vez levantado el servidor, puedes acceder a:

- `GET /api/kpis` - Métricas del negocio
- `GET /api/kpis/dashboard` - Todas las Métricas  del dashboard:
- `GET /api/kpis/produccion` - Métricas de produccion:
- `GET /api/kpis/calidad` - Métricas de calidad:
- `GET /api/kpis/logistica` - Métricas de logistica:
- `GET /api/kpis/ventas` - Métricas de ventas:
- `GET /api/kpis/fallas-por-equipo` - Métricas defallas:
