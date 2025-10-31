// import Dashboard from './components/dashboard'

// function App() {
//   return (
//     <Dashboard />
//   )
// }

// export default App

import { Routes, Route } from "react-router-dom";
import MenuPrincipal from "./components/MenuPpal";
import Ventas from "./pages/Ventas";
import Todos from "./pages/Todos";
import Produccion from "./pages/Produccion";
import Logistica from "./pages/Logistica";
import Calidad from "./pages/Calidad";

export default function App() {
  return (
    <div className="divMenuPpal min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <Routes>
        <Route path="/" element={<MenuPrincipal />} />
        <Route path="/ventas" element={<Ventas />} />
        <Route path="/produccion" element={<Produccion />} />
        <Route path="/logistica" element={<Logistica />} />
        <Route path="/calidad" element={<Calidad />} />
        <Route path="/todos" element={<Todos />} />
      </Routes>
    </div>
  );
}
