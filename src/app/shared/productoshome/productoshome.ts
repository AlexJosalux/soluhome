import { Component, inject, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { ProductoService } from '../../services/producto-service';
import { CarritoService } from '../../services/carrito-service';
import { AuthService } from '../../services/auth-service';
import { Producto } from '../../models/producto';
import { CarritoItem } from '../../models/carrito-item';
import { ProductoCard } from '../producto-card/producto-card';

@Component({
  selector: 'app-productoshome',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductoCard],
  templateUrl: './productoshome.html',
  styleUrl: './productoshome.css'
})
export class Productoshome implements OnInit {
  // --- INYECCIÓN DE SERVICIOS ---
  private readonly productoSrv = inject(ProductoService);
  public readonly carritoService = inject(CarritoService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  // --- ESTADOS REACTIVOS (SIGNALS) ---
  public terminoBusqueda = signal<string>('');
  public productoSeleccionado = signal<Producto | null>(null);
  public productoAnadidoId = signal<number | null>(null);

  // --- LÓGICA DE FILTRADO ---
  // Se recalculan automáticamente al cambiar el catálogo o el término de búsqueda
 public productosFiltrados = computed(() => {
  const todos = this.productoSrv.productos(); // Signal con la lista de productos
  const filtro = this.terminoBusqueda().toLowerCase();

  if (!filtro) return todos;

  return todos.filter(p => 
    p.nombre.toLowerCase().includes(filtro) || 
    p.categoria.toLowerCase().includes(filtro)
  );
});

  // Signal computado para rastrear qué IDs ya están en el presupuesto
  public idsEnCarrito = computed(() => 
    this.carritoService.items().map(item => item.id)
  );

  ngOnInit(): void {
    // Sincronización inicial con el backend de Spring Boot
    this.productoSrv.getProductos().subscribe();
  }

  // --- MÉTODOS DE INTERFAZ ---

  buscarProducto(termino: string): void {
    this.terminoBusqueda.set(termino);
  }

  /**
   * Verifica si un producto ya existe en el carrito para feedback visual
   */
  estaEnCarrito(id: number | undefined): boolean {
    if (id === undefined) return false;
    return this.idsEnCarrito().includes(id); 
  }

  /**
   * Agrega un producto al carrito transformándolo en CarritoItem
   */
  agregarAlCarrito(event: Event, item: Producto): void {
    if (event) event.stopPropagation();

    // Verificación de sesión centralizada
    if (!this.authService.sesionIniciada()) {
      alert('Inicia sesión para solicitar este producto en SoluHome.');
      this.router.navigate(['/login']);
      return;
    }

    // Construcción del objeto según la interfaz CarritoItem (Fuerte tipado)
    // Se eliminó 'agregadoEn' para coincidir con la interfaz simplificada
    const itemCarrito: CarritoItem = {
      id: item.id!, // Forzamos id ya que viene de DB
      nombre: item.nombre,
      precio: item.precio,
      cantidad: 1, // Cantidad inicial para el presupuesto
      imagenUrl: item.imagenUrl,
      sku: item.sku,
      tipo: 'PRODUCTO'
    };

    // Llamada al servicio de carrito
    this.carritoService.agregar(itemCarrito);
    
    // Feedback visual temporal
    if (item.id) {
      this.productoAnadidoId.set(item.id);
      setTimeout(() => this.productoAnadidoId.set(null), 2000);
    }
  }

  // --- GESTIÓN DEL MODAL ---

  abrirModal(producto: Producto): void {
    this.productoSeleccionado.set(producto);
    document.body.style.overflow = 'hidden';
  }

  cerrarModal(): void {
    this.productoSeleccionado.set(null);
    document.body.style.overflow = 'auto';
  }

  /**
   * Ejecuta la compra desde la vista de detalle (modal)
   */
  comprarDesdeModal(): void {
    const p = this.productoSeleccionado(); 
    if (p) {
      this.agregarAlCarrito(new Event('click'), p);
      this.cerrarModal();
    }
  }
}