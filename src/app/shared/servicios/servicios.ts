import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { Servicio } from '../../models/servicio';
import { DataService } from '../../services/data-servicios'; // Para MockAPI (Catálogo)
import { CarritoService } from '../../services/carrito';
import { UsuarioService } from '../../services/usuario-service'; // Tu nueva API de Spring Boot
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
  private usuarioService = inject(UsuarioService); // Inyectamos la conexión a la DB
  private router = inject(Router);

  public servicioAnadidoId: string | null = null;

  // Seguimiento de lo que ya está en el carrito
  public idsEnCarrito = computed(() => 
    this.carritoService.items().map(item => item.id)
  );

  // 1. SERVICIOS LOCALES (Como respaldo o catálogo estático)
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
    // Carga de catálogo desde MockAPI
    this.dataService.getServicios().subscribe({
      next: (data) => this.listaServiciosApi.set(data),
      error: (err) => console.error('Error cargando servicios:', err)
    });
  }

  estaAnadido(id: string): boolean {
    return this.idsEnCarrito().includes(id);
  }

  /**
   * MÉTODO PRINCIPAL: Selecciona el servicio y busca un técnico real en PostgreSQL
   */
  seleccionarServicio(servicio: Servicio) {
    const session = localStorage.getItem('user');

    if (!session) {
      this.router.navigate(['/login']);
      return;
    }

    if (this.estaAnadido(servicio.id)) return;

    // Llamada a tu API de Spring Boot para asignar un técnico de la base de datos
    this.usuarioService.getTecnicosPorEspecialidad(servicio.categoria).subscribe({
      next: (tecnicos) => {
        // Si hay técnicos en la DB, tomamos el primero, si no, dejamos pendiente
        const tecnicoAsignado = tecnicos.length > 0 
          ? `${tecnicos[0].nombre} ${tecnicos[0].apellido}` 
          : 'Técnico por asignar';
        
        const tecnicoId = tecnicos.length > 0 ? tecnicos[0].id : null;

        const itemCarrito = {
          ...servicio,
          nombre: servicio.titulo,
          precio: servicio.precioBase,
          tipo: 'servicio',
          tecnico: tecnicoAsignado,
          tecnicoId: tecnicoId, // ID real de la DB para la relación ManyToOne
          fechaAsignada: null,
          horaAsignada: null,
          createdAt: new Date().toISOString(),
          metodoPago: 'Pendiente de selección'
        };

        this.carritoService.agregar(itemCarrito);
        this.servicioAnadidoId = servicio.id;

        setTimeout(() => this.servicioAnadidoId = null, 2000);
      },
      error: (err) => {
        console.error('Error al conectar con la base de datos de técnicos:', err);
        // Fallback: agregamos el servicio aunque falle la búsqueda del técnico
        this.carritoService.agregar({...servicio, nombre: servicio.titulo, precio: servicio.precioBase});
      }
    });
  }
}