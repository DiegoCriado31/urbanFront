
import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Nosotros from './components/Nosotros';
import NosotrosDetalle from './components/NosotrosDetalle';
import Blogs from './components/Blogs';
import Contacto from './components/Contacto';
import Catalogo from './components/Catalogo';
import AdminPanel from './components/AdminPanel';
import Auth from './components/Auth';
import Carrito from './components/Carrito';
import productosBase from './data/productos.json';
import Footer from './components/Footer';
import BlogTallas from './components/BlogTallas';
import BlogCulturaPop from './components/BlogCulturaPop';
import './App.css';

export default function App() {
  const navigate = useNavigate();

  // Estado del carrito
  const [carrito, setCarrito] = useState([]);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);

  // Agregar productos al carrito
  const agregarProducto = (producto) => {
    setCarrito((actual) => {
      const existente = actual.find((item) => item.id === producto.id);

      if (existente) {
        return actual.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }

      return [...actual, { ...producto, cantidad: 1 }];
    });
  };

  // Actualizar cantidad de productos
  const actualizarCantidad = (id, cantidad) => {
    const nuevaCantidad = Number(cantidad);

    if (nuevaCantidad <= 0) {
      setCarrito((actual) => actual.filter((item) => item.id !== id));
      return;
    }

    setCarrito((actual) =>
      actual.map((item) =>
        item.id === id
          ? { ...item, cantidad: nuevaCantidad }
          : item
      )
    );
  };

  // Eliminar producto del carrito
  const eliminarProducto = (id) => {
    setCarrito((actual) => actual.filter((item) => item.id !== id));
  };

  // Calcular total de unidades
  const totalUnidades = carrito.reduce(
    (total, item) => total + item.cantidad,
    0
  );

  // Usuario activo
  const [usuario, setUsuario] = useState(() => {
    try {
      const sesion = localStorage.getItem('sesionActiva');
      return sesion ? JSON.parse(sesion) : null;
    } catch {
      return null;
    }
  });

  const [mostrarAuth, setMostrarAuth] = useState(false);

  // Productos del catálogo
  const [productos, setProductos] = useState(() => {
    try {
      const guardados = localStorage.getItem('urban_productos');

      if (guardados) {
        const parsed = JSON.parse(guardados);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }

    return Array.isArray(productosBase) ? productosBase : [];
  });

  const handleCerrarSesion = () => {
    localStorage.removeItem('sesionActiva');
    setUsuario(null);
    navigate('/');
  };

  return (
    <div className="bg-dark text-white min-vh-100 d-flex flex-column">

      <Header
        cantidadCarrito={totalUnidades}
        onAbrirCarrito={() => navigate('/carrito')}
        onAbrirAuth={() => setMostrarAuth(true)}
        usuarioActivo={usuario}
        onCerrarSesion={handleCerrarSesion}
      />

      <main className="flex-grow-1 pt-3">
        <Routes>

          <Route path="/" element={
            <>
              <Hero />
              <div className="container py-4">
                <h2 className="text-center text-warning fw-bold mb-4">
                  COLECCIÓN DESTACADA
                </h2>
                <Catalogo onAgregarAlCarrito={agregarProducto} />
              </div>
              <Nosotros />
            </>
          } />

          <Route path="/productos" element={
            <div className="container py-4">
              <h2 className="text-center text-warning fw-bold mb-4">
                CATÁLOGO COMPLETO
              </h2>
              <Catalogo onAgregarAlCarrito={agregarProducto} />
            </div>
          } />

          <Route path="/nosotros" element={<NosotrosDetalle />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/tallas" element={<BlogTallas />} />
          <Route path="/blogs/cultura-pop" element={<BlogCulturaPop />} />
          <Route path="/contacto" element={<Contacto />} />

          <Route path="/carrito" element={
            <Carrito
              items={carrito}
              onActualizarCantidad={actualizarCantidad}
              onEliminar={eliminarProducto}
              onProcesarPago={() => alert('¡Procesando pedido!')}
            />
          } />

          <Route path="/admin" element={
            <AdminPanel
              productos={productos}
              onActualizarProductos={setProductos}
              onVolverTienda={() => navigate('/')}
            />
          } />

          <Route
            path="*"
            element={
              <h1 className="container py-5 text-center">
                Página no encontrada
              </h1>
            }
          />

        </Routes>
      </main>

      <Footer />

      <Auth
        visible={mostrarAuth}
        onClose={() => setMostrarAuth(false)}
        onLoginExitoso={(usr) => setUsuario(usr)}
      />

    </div>
  );
}
