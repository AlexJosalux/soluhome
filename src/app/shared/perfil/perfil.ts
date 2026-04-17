import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderPerfil } from '../header-perfil/header-perfil';
import { TablaGestionPedidos } from '../tabla-gestion-pedidos/tabla-gestion-pedidos';
import { ListaTecnicosAdmin } from '../lista-tecnicos-admin/lista-tecnicos-admin';

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
  @Input() data: any;

  public mensajeEnviado: boolean = false; 
  
  public usuarioActual: any = { 
    id: '', 
    nombre: '', 
    rol: '', 
    pedidos: [] 
  };
  
  public trabajosAsignados: any[] = [];
  public todosLosPedidos: any[] = [];

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && changes['data'].currentValue) {
      this.procesarUsuario(changes['data'].currentValue);
    }
  }

  ngOnInit() {
    // Intentar recuperar sesión si no hay data por Input
    const session = this.obtenerSesionDeStorage();
    if (this.data) {
      this.procesarUsuario(this.data);
    } else if (session) {
      this.procesarUsuario(session);
    }
  }

  private obtenerSesionDeStorage() {
    const raw = localStorage.getItem('usuario') || 
                localStorage.getItem('user_session') || 
                localStorage.getItem('user');
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  private procesarUsuario(user: any) {
    // CORRECCIÓN: Aseguramos que el nombre y el ID se mapeen sin importar el origen
    this.usuarioActual = { 
      ...user, 
      id: user.id || user.uid || user.localId,
      nombre: user.nombre || user.displayName || 'Usuario SoluHome',
      rol: (user.rol || 'cliente').toLowerCase().trim() 
    };
    
    // Si no tiene el array de pedidos, lo inicializamos para evitar errores en el @for
    if (!this.usuarioActual.pedidos) {
      this.usuarioActual.pedidos = [];
    }
    
    console.log("Perfil cargado para:", this.usuarioActual.nombre, "con Rol:", this.usuarioActual.rol);
    this.cargarMisPedidos();
  }

  enviarMensaje(): void {
    this.mensajeEnviado = true;
    setTimeout(() => this.mensajeEnviado = false, 5000);
  }

  cargarMisPedidos() {
    // Leemos la "base de datos" local
    const pedidosRaw = localStorage.getItem('pedidos_db');
    const todosLosPedidosBD = JSON.parse(pedidosRaw || '[]'); 
    
    // El ID debe ser String para que el filtro '===' no falle por tipo (número vs string)
    const currentUserId = String(this.usuarioActual.id || '').trim();

    if (!currentUserId) {
      console.warn("No se pudo obtener el ID del usuario actual para cargar pedidos.");
      return;
    }

    if (this.usuarioActual.rol === 'cliente') {
      this.usuarioActual.pedidos = todosLosPedidosBD
        .filter((p: any) => String(p.clienteId || '').trim() === currentUserId)
        .map((p: any) => ({
          ...p,
          // Aseguramos que cada pedido tenga datos de visualización
          clienteNombre: p.clienteNombre || this.usuarioActual.nombre,
          tecnico: p.tecnico || p.especialista || 'Pendiente de asignar',
          items: p.items || []
        })).reverse();
    } 
    else if (this.usuarioActual.rol === 'tecnico') {
      this.trabajosAsignados = todosLosPedidosBD
        .filter((p: any) => String(p.tecnicoId || '').trim() === currentUserId)
        .reverse();
    }
    else if (this.usuarioActual.rol === 'admin') {
      this.todosLosPedidos = todosLosPedidosBD.map((pedido: any) => ({
        ...pedido,
        clienteNombre: pedido.clienteNombre || 'Cliente Registrado',
        tecnico: pedido.tecnico || pedido.especialista || 'Pendiente de asignar'
      })).reverse();
    }
  }
}