import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  
  // 1. Inicializamos el signal cargando los datos de localStorage directamente
  public items = signal<any[]>(this.cargarStorage());

  constructor() {
    // 2. Efecto automático: Cada vez que 'items' cambie, se guarda en el storage
    effect(() => {
      localStorage.setItem('soluhome_cart', JSON.stringify(this.items()));
    });
  }

  // Función privada para la carga inicial
  private cargarStorage(): any[] {
    const data = localStorage.getItem('soluhome_cart');
    return data ? JSON.parse(data) : [];
  }

  // MÉTODO AGREGAR: El que llaman tus botones de productos y servicios
  agregar(item: any) {
    this.items.update(prev => [...prev, item]);
    console.log('🛍️ Carrito actualizado:', this.items().length, 'items');
  }

  // MÉTODO QUITAR: Para eliminar por índice
  quitar(index: number) {
    this.items.update(prev => prev.filter((_, i) => i !== index));
  }

  // Opcional: Limpiar todo el carrito
  limpiar() {
    this.items.set([]);
  }
}