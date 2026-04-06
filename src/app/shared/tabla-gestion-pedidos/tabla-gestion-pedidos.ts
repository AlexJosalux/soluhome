import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tabla-gestion-pedidos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabla-gestion-pedidos.html',
  styleUrl: './tabla-gestion-pedidos.css',
})
export class TablaGestionPedidos implements OnInit {
  pedidos: any[] = [];

  ngOnInit() {
    this.cargarPedidos();
  }

  cargarPedidos() {
    const data = localStorage.getItem('pedidos_db');
    this.pedidos = data ? JSON.parse(data) : [];
  }

  /**
   * ASIGNACIÓN AUTOMÁTICA INTELIGENTE
   * Busca al técnico cuya especialidad coincida con el servicio del pedido
   */
  abrirAsignacion(pedido: any) {
    // 1. Obtener los técnicos de la base de datos que ya tienes
    const usuariosRaw = localStorage.getItem('usuarios_db') || '[]';
    const todosLosUsuarios = JSON.parse(usuariosRaw);
    const listaTecnicos = todosLosUsuarios.filter((u: any) => u.rol === 'tecnico');

    // 2. Identificar qué servicio compró el cliente (tomamos el primero del carrito)
    const categoriaServicio = pedido.items[0]?.categoria || pedido.items[0]?.nombre;

    // 3. Buscar un técnico que coincida con esa especialidad y esté disponible
    // Nota: Usamos 'includes' o comparación directa según cómo guardes el nombre
    let tecnicoAsignado = listaTecnicos.find((t: any) => 
      t.disponible && (categoriaServicio.includes(t.especialidad) || t.especialidad.includes(categoriaServicio))
    );

    // 4. Si no encuentra uno por especialidad, asigna el primero disponible por defecto
    if (!tecnicoAsignado) {
      tecnicoAsignado = listaTecnicos.find((t: any) => t.disponible);
    }

    if (tecnicoAsignado) {
      // 5. Inyectar los datos reales en el pedido
      pedido.tecnico = tecnicoAsignado.nombre; // Esto es lo que lee Perfil.ts
      pedido.tecnicoId = tecnicoAsignado.id;
      pedido.estado = 'EN_PROCESO';

      // 6. Guardar en pedidos_db
      const pedidosBD = JSON.parse(localStorage.getItem('pedidos_db') || '[]');
      const index = pedidosBD.findIndex((p: any) => p.id === pedido.id);

      if (index !== -1) {
        pedidosBD[index] = pedido;
        localStorage.setItem('pedidos_db', JSON.stringify(pedidosBD));
        
        alert(`¡Asignación Automática! Técnico: ${tecnicoAsignado.nombre} (${tecnicoAsignado.especialidad})`);
        this.cargarPedidos();
      }
    } else {
      alert('No hay técnicos disponibles en este momento.');
    }
  }
}