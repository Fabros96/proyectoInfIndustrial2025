import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart, Factory, Truck, CheckCircle, Rows3 } from "lucide-react";

export default function MenuPrincipal() {
  const navigate = useNavigate();

  const botones = [
    {
      nombre: "Ventas",
      ruta: "/ventas",
      color: "from-blue-500 to-blue-700",
      icono: <ShoppingCart size={44} />,
    },
    {
      nombre: "Producción",
      ruta: "/produccion",
      color: "from-green-500 to-green-700",
      icono: <Factory size={44} />,
    },
    {
      nombre: "Logística",
      ruta: "/logistica",
      color: "from-yellow-400 to-yellow-600",
      icono: <Truck size={44} />,
    },
    {
      nombre: "Calidad",
      ruta: "/calidad",
      color: "from-red-500 to-red-700",
      icono: <CheckCircle size={44} />,
    },
    {
      nombre: "TODOS",
      ruta: "/todos",
      color: "from-red-500 to-red-700",
      icono: <Rows3 size={44} />,
    },
  ];

  // Separamos TODOS
  const botonesPrincipales = botones.slice(0, botones.length - 1);
  const botonTodos = botones[botones.length - 1];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 p-6">
      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-5xl font-extrabold mb-14 text-gray-800 drop-shadow-sm tracking-tight"
      >
        ----SPORTMAX----
        <br />
        🌟Menu Principal
      </motion.h1>

      {/* Grid de botones principales */}
      <div className="inline-flex grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 w-full max-w-6xl">
        {botonesPrincipales.map((btn, i) => (
          <motion.div
            key={btn.nombre}
            onClick={() => navigate(btn.ruta)}
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            whileHover={{
              scale: 1.08,
              boxShadow: "0px 8px 30px rgba(0,0,0,0.25)",
              backgroundImage:
                "linear-gradient(to bottom right, #ef4444, #b91c1c)",
              transition: { duration: 0.3, ease: "easeInOut" },
            }}
            whileTap={{ scale: 0.97 }}
            className={`subdivMenuPpal relative bg-gradient-to-br ${btn.color} text-white rounded-3xl shadow-xl p-10 flex flex-col items-center justify-center gap-4 cursor-pointer overflow-hidden`}
          >
            <motion.div
              className="absolute inset-0 bg-white opacity-10 blur-2xl"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 0.25 }}
              transition={{ duration: 0.3 }}
            />
            <div className="relative z-10 bg-white/20 p-5 rounded-full backdrop-blur-sm">
              {btn.icono}
            </div>
            <h2 className="relative z-10 text-2xl font-bold drop-shadow-sm">
              {btn.nombre}
            </h2>
          </motion.div>
        ))}
      </div>

      {/* Botón TODOS separado */}
      <div className="mt-10">
        <motion.div
          onClick={() => navigate(botonTodos.ruta)}
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          whileHover={{
            scale: 1.08,
            boxShadow: "0px 8px 30px rgba(0,0,0,0.25)",
            backgroundImage:
              "linear-gradient(to bottom right, #ef4444, #b91c1c)",
            transition: { duration: 0.3, ease: "easeInOut" },
          }}
          whileTap={{ scale: 0.97 }}
          className={`subdivMenuPpal relative bg-gradient-to-br ${botonTodos.color} text-white rounded-3xl shadow-xl p-10 flex flex-col items-center justify-center gap-4 cursor-pointer overflow-hidden`}
        >
          <motion.div
            className="absolute inset-0 bg-white opacity-10 blur-2xl"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 0.25 }}
            transition={{ duration: 0.3 }}
          />
          <div className="relative z-10 bg-white/20 p-5 rounded-full backdrop-blur-sm">
            {botonTodos.icono}
          </div>
          <h2 className="relative z-10 text-2xl font-bold drop-shadow-sm">
            {botonTodos.nombre}
          </h2>
        </motion.div>
      </div>

      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-16 text-gray-600 text-sm"
      >
        FRM — UTN — © {new Date().getFullYear()} Informática Industrial —
        SPORTMAX — Panel de Control
      </motion.footer>
    </div>
  );
}
