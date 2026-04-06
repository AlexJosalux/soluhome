import { Component, inject, OnInit, computed, signal } from '@angular/core'; // Añadido computed y signal
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductoService } from '../../services/producto';
import { Producto } from '../../models/producto';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { CarritoService } from '../../services/carrito';
import { Router } from '@angular/router';

@Component({
  selector: 'app-productoshome',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './productoshome.html',
  styleUrl: './productoshome.css'
})
export class Productoshome implements OnInit {
  productosFiltrados$!: Observable<Producto[]>;
  private filtroSubject = new BehaviorSubject<string>('');
  private productoSrv = inject(ProductoService);
  public carritoService = inject(CarritoService);
  private router = inject(Router);
  
  productoSeleccionado: Producto | null = null;
  public productoAnadidoId: string | null = null;

  // --- MEJORA 1: Persistencia del estado "Añadido" ---
  // Mantenemos una lista reactiva de los IDs que ya están en el carrito
  public idsEnCarrito = computed(() => 
    this.carritoService.items().map(item => item.id)
  );

  ngOnInit(): void {
    const todosLosProductos$ = this.productoSrv.getProductos();
    this.productosFiltrados$ = combineLatest([
      todosLosProductos$,
      this.filtroSubject.asObservable()
    ]).pipe(
      map(([productos, termino]) => {
        const t = termino.toLowerCase();
        return productos.filter(p => 
          p.nombre.toLowerCase().includes(t) || 
          p.categoria.toLowerCase().includes(t)
        );
      })
    );
  }

  // Helper para el HTML para mantener el botón naranja si ya existe en el carrito
  estaEnCarrito(id: string): boolean {
    return this.idsEnCarrito().includes(id);
  }

  buscarProducto(termino: string): void {
    this.filtroSubject.next(termino);
  }

  agregarAlCarrito(event: Event, item: Producto): void {
    if (event) event.stopPropagation(); 

    // --- BLOQUEO DE SEGURIDAD ---
    const usuario = localStorage.getItem('user'); 

    if (!usuario) {
      console.warn('⚠️ Usuario no autenticado. Redirigiendo...');
      this.router.navigate(['/login']);
      return; 
    }

    // --- MEJORA 2: Validación de Stock (Simulada) ---
    // Si el producto tuviera una propiedad stock, podrías bloquearlo aquí
    // if (item.stock <= 0) { alert('Sin existencias'); return; }

    // Evitamos duplicar si ya está añadido (opcional, según tu lógica de negocio)
    if (this.estaEnCarrito(item.id)) {
      console.log('El producto ya está en el presupuesto.');
    }

    // --- MEJORA 3: Trazabilidad para la futura API ---
    const itemConAuditoria = {
      ...item,
      tipo: 'producto',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      metodoPago: 'Pendiente de selección'
    };

    this.carritoService.agregar(itemConAuditoria);
    
    this.productoAnadidoId = item.id;
    setTimeout(() => {
      this.productoAnadidoId = null;
    }, 2000);

    console.log(`✅ ${item.nombre} añadido al carrito.`);
  }

  comprarDesdeModal(): void {
    if (this.productoSeleccionado) {
      this.agregarAlCarrito(new Event('click'), this.productoSeleccionado);
      this.cerrarModal();
    }
  }

  abrirModal(producto: Producto): void {
    this.productoSeleccionado = producto;
    document.body.style.overflow = 'hidden';
  }

  cerrarModal(): void {
    this.productoSeleccionado = null;
    document.body.style.overflow = 'auto';
  }
}