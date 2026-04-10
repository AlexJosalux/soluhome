import { Component, OnInit, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderPerfil } from '../header-perfil/header-perfil';
import { TablaGestionPedidos } from '../tabla-gestion-pedidos/tabla-gestion-pedidos';
import { ListaTecnicosAdmin } from '../lista-tecnicos-admin/lista-tecnicos-admin';
import { PedidoService } from '../../services/pedido'; 
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    CommonModule, 
    HeaderPerfil, 
    TablaGestionPedidos, 
    ListaTecnicosAdmin
  ],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css'
})
export class Perfil implements OnInit, OnChanges {
  private pedidoService = inject(PedidoService);
  private authService = inject(AuthService);

  @Input() data: any;
  mensajeEnviado: boolean = false;

  usuarioActual: any = { 
    id: '', 
    nombre: '', 
    rol: '', 
    pedidos: [] 
  };
  
  trabajosAsignados: any[] = [];
  todosLosPedidos: any[] = [];

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && changes['data'].currentValue) {
      this.usuarioActual = { ...changes['data'].currentValue };
      this.cargarDatosDesdeAPI();
    }
  }

  ngOnInit() {
    this.verificarSesionLocal();
    this.cargarDatosDesdeAPI();
  }

  private verificarSesionLocal() {
    const session = this.authService.usuarioLogueado() || JSON.parse(localStorage.getItem('user') || 'null');
    
    if (session) {
      this.usuarioActual = session;
    }
  }

  cargarDatosDesdeAPI() {
    // Verificación de seguridad: Si no hay ID, no intentamos filtrar
    if (!this.usuarioActual.id) return;

    const currentUserId = Number(this.usuarioActual.id);

    this.pedidoService.getPedidos().subscribe({
      next: (pedidosBD) => {
        // 1. FILTRAR Y ORDENAR (Para el Cliente)
        const misPedidos = pedidosBD
          .filter((p: any) => Number(p.cliente?.id) === currentUserId)
          .sort((a: any, b: any) => b.id - a.id);

        // 2. FILTRAR TRABAJOS (Para el Técnico)
        this.trabajosAsignados = pedidosBD
          .filter((p: any) => Number(p.tecnicoId) === currentUserId)
          .sort((a: any, b: any) => b.id - a.id);

        // 3. MAPEAR PARA MOSTRAR LA INFORMACIÓN COMPLETA
        this.usuarioActual.pedidos = misPedidos.map((p: any) => ({
          ...p,
          clienteNombre: p.cliente?.nombre || this.usuarioActual.nombre,
          // Sincronizamos ambos nombres para que el HTML nunca falle al leer la propiedad
          tecnicoAsignado: p.tecnicoNombre || 'No requiere técnico',
          tecnicoNombre: p.tecnicoNombre || 'Pendiente de asignación', 
          detalles: p.detalles?.map((d: any) => ({
            ...d,
            nombreAMostrar: d.nombreItem || d.item?.nombre || 'Servicio/Producto'
          }))
        }));

        // 4. MAPEO ADICIONAL PARA LA VISTA DE TÉCNICO (trabajosAsignados)
        this.trabajosAsignados = this.trabajosAsignados.map((p: any) => ({
            ...p,
            detalles: p.detalles?.map((d: any) => ({
                ...d,
                nombreAMostrar: d.nombreItem || d.item?.nombre || 'Servicio'
            }))
        }));

        // Guardamos todos para el rol admin
        this.todosLosPedidos = [...pedidosBD].sort((a: any, b: any) => b.id - a.id);
      },
      error: (err) => console.error("Error al cargar perfil desde PostgreSQL", err)
    });
  }
}