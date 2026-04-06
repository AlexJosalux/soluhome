import { Component, OnInit, inject, signal, computed } from '@angular/core'; // Añadido computed
import { CommonModule } from '@angular/common'; 
import { Servicio } from '../../models/servicio';
import { DataService } from '../../services/data-servicios';
import { CarritoService } from '../../services/carrito';
import { Router } from '@angular/router';

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './servicios.html',
  styleUrl: './servicios.css',
})
export class Servicios implements OnInit {
  private dataService = inject(DataService);
  private carritoService = inject(CarritoService);
  private router = inject(Router);

  public servicioAnadidoId: string | null = null;

  // --- MEJORA 1: Persistencia del estado "Añadido" ---
  // Creamos un Signal computado que mapea los IDs de lo que ya está en el carrito
  public idsEnCarrito = computed(() => 
    this.carritoService.items().map(item => item.id)
  );

  // 1. SERVICIOS GENERALES
  public serviciosGenerales = signal<Servicio[]>([
    {
      id: 'gen-001',
      titulo: 'Revisión Eléctrica',
      categoria: 'Electricidad',
      imagen: 'https://i.postimg.cc/WbwLMBdG/revisionelec.png',
      precioBase: 10.00,
      precioPost: 0,
      fechaServicio: new Date().toISOString(),
      incluye: ['Revisión de tablero', 'Prueba de voltaje', 'Informe técnico'],
      estado: 'Disponible'
    },
    {
      id: 'gen-002',
      titulo: 'Plomería',
      categoria: 'Plomería',
      imagen: 'https://i.postimg.cc/HkkKbVGS/plomeria.png',
      precioBase: 10.00,
      precioPost: 0,
      fechaServicio: new Date().toISOString(),
      incluye: ['Detección de fugas', 'Reparación de tubería básica', 'Limpieza de filtro'],
      estado: 'Disponible'
    },
    {
      id: 'gen-003',
      titulo: 'Pintura de Interiores',
      categoria: 'Pintura',
      imagen: 'https://i.postimg.cc/MKd3Zqc5/pintura.png',
      precioBase: 10.00,
      precioPost: 0,
      fechaServicio: new Date().toISOString(),
      incluye: ['Protección de muebles', 'Resane de grietas', 'Aplicación de dos manos de pintura'],
      estado: 'Disponible'
    },
    {
      id: 'gen-004',
      titulo: 'Mantenimiento de Línea Blanca', 
      categoria: 'Línea Blanca',
      imagen: 'https://i.postimg.cc/YSgxFH9w/lineablanca.png',
      precioBase: 10.00,
      precioPost: 0,
      fechaServicio: new Date().toISOString(),
      incluye: ['Limpieza de filtros', 'Revisión de motor', 'Engrasado'],
      estado: 'Disponible'
    }
  ]);

  public listaServiciosApi = signal<Servicio[]>([]);

  ngOnInit() {
    this.dataService.getServicios().subscribe({
      next: (data) => this.listaServiciosApi.set(data),
      error: (err) => console.error('Error cargando servicios:', err)
    });
  }

  // Helper para el HTML: verifica si el ID ya existe en el carrito
  estaAnadido(id: string): boolean {
    return this.idsEnCarrito().includes(id);
  }

  seleccionarServicio(servicio: Servicio) {
    const session = localStorage.getItem('user');

    if (!session) {
      this.router.navigate(['/login']);
      return;
    }

    // --- MEJORA 2: Validación de disponibilidad horaria (Simulada) ---
    // Si quisieras evitar duplicados de servicios en el mismo "bloque", aquí iría la validación
    if (this.estaAnadido(servicio.id)) {
        return; // No hace nada si ya está en el carrito
    }

    const tecnicoAsignado = this.asignarTecnicoAutomatico(servicio.categoria);

    // --- MEJORA 3: Trazabilidad y Metadatos ---
    const itemCarrito = {
      ...servicio,
      nombre: servicio.titulo,
      precio: servicio.precioBase,
      tipo: 'servicio',
      tecnico: tecnicoAsignado,
      fechaAsignada: null,
      horaAsignada: null,
      // Campos de auditoría para la futura base de datos
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      metodoPago: 'Pendiente de selección' // Se definirá en el carrito al finalizar
    };

    this.carritoService.agregar(itemCarrito);
    this.servicioAnadidoId = servicio.id;

    setTimeout(() => this.servicioAnadidoId = null, 2000);
  }

  private asignarTecnicoAutomatico(categoria: string): string {
    const storedUsers = localStorage.getItem('usuarios_db');
    
    if (storedUsers) {
      const todosLosUsuarios = JSON.parse(storedUsers);
      
      const tecnicosDisponibles = todosLosUsuarios.filter((u: any) => 
        u.rol === 'tecnico' && 
        u.especialidad === categoria && 
        u.disponible === true
      );

      if (tecnicosDisponibles.length > 0) {
        return tecnicosDisponibles[0].nombre;
      }
    }

    return 'Técnico por asignar';
  }
}