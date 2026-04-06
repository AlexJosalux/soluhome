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
  // Recibe los datos desde el componente padre (Usuarios)
  @Input() data: any;
  mensajeEnviado: boolean = false;

  // Estructura inicial para evitar errores de 'undefined' en el HTML
  usuarioActual: any = { 
    id: '', 
    nombre: '', 
    rol: '', 
    pedidos: [] 
  };
  
  trabajosAsignados: any[] = [];
  
  // 1. DECLARACIÓN DE LA PROPIEDAD PARA EL ADMIN (Esto quita el error TS2339)
  todosLosPedidos: any[] = [];

  constructor() {}

  /**
   * Detecta cambios en el Input 'data'. 
   * Si el AuthService en el padre actualiza el usuario, este método se dispara.
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && changes['data'].currentValue) {
      this.usuarioActual = { ...changes['data'].currentValue };
      // Si el objeto no tiene el array de pedidos, lo inicializamos
      if (!this.usuarioActual.pedidos) {
        this.usuarioActual.pedidos = [];
      }
      this.cargarMisPedidos();
    }
  }

  ngOnInit() {
    // Intento de carga desde LocalStorage por si el Input no llega a tiempo
    this.verificarSesionLocal();
    this.cargarMisPedidos();
  }

  /**
   * Recupera la sesión directamente de LocalStorage como respaldo
   */
  private verificarSesionLocal() {
    const session = localStorage.getItem('usuario') || 
                    localStorage.getItem('user_session') || 
                    localStorage.getItem('user');
    
    if (!this.data && session) {
      try {
        this.usuarioActual = JSON.parse(session);
      } catch (e) {
        console.error("Error al parsear la sesión en Perfil", e);
      }
    }
  }

  /**
   * Filtra la base de datos de pedidos local (pedidos_db)
   */
  cargarMisPedidos() {
    const pedidosRaw = localStorage.getItem('pedidos_db');
    const todosLosPedidosBD = JSON.parse(pedidosRaw || '[]'); 
    
    // Obtenemos el ID del usuario actual de forma segura (String y sin espacios)
    const currentUserId = String(
      this.usuarioActual.id || 
      this.usuarioActual.uid || 
      this.usuarioActual.localId || ''
    ).trim();

    // Log de depuración para la consola (F12)
    console.log("Intentando cargar pedidos para el usuario:", currentUserId);

    // Lógica para CLIENTES
    if (this.usuarioActual.rol === 'cliente') {
      const filtrados = todosLosPedidosBD.filter((p: any) => {
        const pClienteId = String(p.clienteId || '').trim();
        return pClienteId === currentUserId && currentUserId !== '';
      });

      // ARREGLO IMPLEMENTADO PARA CLIENTE:
      this.usuarioActual.pedidos = filtrados.map((p: any) => ({
        ...p,
        // Aseguramos que el pedido del cliente lleve su nombre para el HTML
        clienteNombre: p.clienteNombre || this.usuarioActual.nombre || 'Cliente SoluHome',
        
        // NORMALIZACIÓN DEL ESPECIALISTA PARA EL CLIENTE:
        // Buscamos en todas las propiedades posibles donde guardaste el dato quemado
        tecnico: p.tecnico || 
                 p.especialista || 
                 p.nombreTecnico || 
                 'Pendiente de asignar'
      })).reverse();
      
      console.log("Pedidos de cliente encontrados:", this.usuarioActual.pedidos.length);
    } 
    
    // Lógica para TÉCNICOS
    else if (this.usuarioActual.rol === 'tecnico') {
      this.trabajosAsignados = todosLosPedidosBD.filter((p: any) => {
        const pTecnicoId = String(p.tecnicoId || '').trim();
        return pTecnicoId === currentUserId && currentUserId !== '';
      });
      console.log("Trabajos de técnico encontrados:", this.trabajosAsignados.length);
    }

    // 2. LÓGICA PARA ADMIN (Actualizada para capturar especialistas quemados)
    else if (this.usuarioActual.rol === 'admin') {
      this.todosLosPedidos = todosLosPedidosBD.map((pedido: any) => {
        return {
          ...pedido,
          // Unifica el nombre del cliente
          clienteNombre: pedido.clienteNombre || pedido.usuarioNombre || 'Cliente Registrado',
          
          // IMPLEMENTACIÓN PARA EL ESPECIALISTA:
          // Buscamos en todas las propiedades posibles donde guardaste el dato quemado
          tecnico: pedido.tecnico || 
                   pedido.especialista || 
                   pedido.nombreTecnico || 
                   'Pendiente de asignar'
        };
      }).reverse();
      
      console.log("Vista Admin: Pedidos procesados con especialistas:", this.todosLosPedidos);
    }
  }
}