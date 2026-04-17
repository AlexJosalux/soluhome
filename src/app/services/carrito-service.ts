import { Injectable, signal, computed } from '@angular/core';
import { CarritoItem } from '../models/carrito-item';

@Injectable({
  providedIn: 'root',
})
export class CarritoService {
  private readonly STORAGE_KEY = 'soluhome_carrito';

  // Signal principal con persistencia inicial
  public items = signal<CarritoItem[]>(this.cargarDesdeStorage());

  // --- CÁLCULOS REACTIVOS ---
  public cantidadTotal = computed(() =>
    this.items().reduce((sum, item) => sum + item.cantidad, 0)
  );

  public totalCarrito = computed(() =>
    this.items().reduce((sum, item) => sum + item.precio * item.cantidad, 0)
  );

  // --- PERSISTENCIA ---
  private guardarEnStorage(items: CarritoItem[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
  }

  private cargarDesdeStorage(): CarritoItem[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) return [];
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Error al recuperar el carrito:', e);
      return [];
    }
  }

  // --- ACCIONES ---

  /**
   * Agrega un ítem validando ID y TIPO para evitar colisiones entre productos y servicios
   */
  agregar(item: CarritoItem): void {
    const actuales = this.items();
    // Validamos que coincida ID y TIPO (Producto o Servicio)
    const existente = actuales.find(i => i.id === item.id && i.tipo === item.tipo);

    if (existente) {
      const nuevosItems = actuales.map(i => 
        (i.id === item.id && i.tipo === item.tipo) 
          ? { ...i, cantidad: i.cantidad + item.cantidad } 
          : i
      );
      this.items.set(nuevosItems);
    } else {
      this.items.set([...actuales, item]);
    }
    this.guardarEnStorage(this.items());
  }

  /**
   * Actualiza la cantidad de un ítem basado en su ID único de base de datos
   */
  actualizarCantidad(id: number, cantidad: number): void {
    if (cantidad <= 0) {
      this.eliminarItem(id);
      return;
    }
    const nuevosItems = this.items().map(item =>
      item.id === id ? { ...item, cantidad } : item
    );
    this.items.set(nuevosItems);
    this.guardarEnStorage(nuevosItems);
  }

  /**
   * Elimina el ítem del presupuesto
   */
  eliminarItem(id: number): void {
    const nuevosItems = this.items().filter(i => i.id !== id);
    this.items.set(nuevosItems);
    this.guardarEnStorage(nuevosItems);
  }

  /**
   * Limpia el carrito por completo
   */
  vaciarCarrito(): void {
    this.items.set([]);
    localStorage.removeItem(this.STORAGE_KEY);
  }
}

