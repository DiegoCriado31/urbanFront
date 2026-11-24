import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import Catalogo from '../components/Catalogo';
import productos from '../data/productos.json';

describe('Componente Catalogo', () => {
  afterEach(() => {
    cleanup();
  });

  // Catalogo lee productos.json directo, así que los tests usan esos mismos datos.
  const primeraZapatilla = productos.find((p) => p.categoria === 'zapatillas');

  it('Renderiza los productos del JSON', () => {
    render(<Catalogo onAgregarAlCarrito={() => {}} />);

    expect(screen.getByText(productos[0].nombre)).not.toBeNull();
    expect(screen.getByText(primeraZapatilla.nombre)).not.toBeNull();
  });

  it('Llama a la función callback al presionar "Agregar al Carrito"', () => {
    let productoAgregado = null;
    const mockAgregar = (prod) => {
      productoAgregado = prod;
    };

    render(<Catalogo onAgregarAlCarrito={mockAgregar} />);

    // La primera sección renderizada es Zapatillas, así que el primer botón es de la primera zapatilla.
    const botones = screen.getAllByRole('button', { name: /agregar al carrito/i });
    fireEvent.click(botones[0]);

    expect(productoAgregado).not.toBeNull();
    expect(productoAgregado.id).toBe(primeraZapatilla.id);
  });

  it('Filtra por género dentro de la sección', () => {
    render(<Catalogo onAgregarAlCarrito={() => {}} />);

    // Primer botón "Hombre" = sección Zapatillas; la zapatilla del JSON es de mujer y debe desaparecer.
    const botonesHombre = screen.getAllByRole('button', { name: /hombre/i });
    fireEvent.click(botonesHombre[0]);

    expect(screen.queryByText(primeraZapatilla.nombre)).toBeNull();
  });
});