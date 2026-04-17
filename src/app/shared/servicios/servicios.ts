import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { RouterLink, Router } from '@angular/router';
import { ServicioService } from '../../services/servicio-service';
import { CarritoService } from '../../services/carrito-service';
import { AuthService } from '../../services/auth-service';
import { Servicio } from '../../models/servicio';
import { CarritoItem } from '../../models/carrito-item';

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './servicios.html',
  styleUrl: './servicios.css',
})
export class Servicios implements OnInit {
  private readonly servicioSrv = inject(ServicioService);
  public readonly carritoService = inject(CarritoService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  // --- ESTADOS REACTIVOS (SIGNALS) ---
  public servicioAnadidoId = signal<number | null>(null);

  // --- LÓGICA DE DATOS ---
  // Obtenemos los servicios del signal del ServicioService
  public listaServicios = computed(() => this.servicioSrv.servicios());

  // Rastreamos los IDs para el feedback visual en los botones
  public idsEnCarrito = computed(() => 
    this.carritoService.items()
      .filter(item => item.tipo === 'SERVICIO')
      .map(item => item.id)
  );

  ngOnInit(): void {
    // Carga inicial desde la API de Spring Boot
    this.servicioSrv.getServicios().subscribe({
      error: (err) => console.error('Error al cargar servicios en SoluHome:', err)
    });
  }

  /**
   * Verifica si un servicio ya está en el presupuesto
   */
  estaAnadido(id: number | undefined): boolean {
    if (id === undefined) return false;
    return this.idsEnCarrito().includes(id);
  }

  /**
   * Agrega el servicio al carrito respetando tu interfaz Servicio
   */
  seleccionarServicio(servicio: Servicio): void {
  // 1. Verificación de seguridad: si no hay ID, no hacemos nada.
  // Esto quita todos los errores de "number | undefined" de abajo.
  if (!servicio.id) return;

  if (this.estaAnadido(servicio.id)) return;

  // 3. Mapeo con los nombres correctos de tu interfaz
  const itemCarrito: CarritoItem = {
    id: servicio.id,
    nombre: servicio.nombre,       // ANTES: titulo (ERROR)
    precio: servicio.precioBase,
    cantidad: 1,
    imagenUrl: servicio.imagenUrl,  // ANTES: imagen (ERROR)
    tipo: 'SERVICIO',
    categoria: servicio.categoria,
    tecnicoId: null,
    fechaAgenda: undefined
  };

  // 4. Ejecución
  this.carritoService.agregar(itemCarrito);

  // 5. Feedback visual (Ya no dará error porque validamos el id arriba)
  this.servicioAnadidoId.set(servicio.id);
  setTimeout(() => this.servicioAnadidoId.set(null), 2000);
}
}