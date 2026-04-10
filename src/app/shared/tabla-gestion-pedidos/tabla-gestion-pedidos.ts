import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PedidoService } from '../../services/pedido'; // Ajusta la ruta
import { UsuarioService } from '../../services/usuario-service'; // Para buscar técnicos si fuera necesario

@Component({
  selector: 'app-tabla-gestion-pedidos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabla-gestion-pedidos.html',
  styleUrl: './tabla-gestion-pedidos.css',
})
export class TablaGestionPedidos implements OnInit {
  // Inyectamos los servicios de la API
  private pedidoService = inject(PedidoService);
  private usuarioService = inject(UsuarioService);

  pedidos: any[] = [];

  ngOnInit() {
    this.cargarPedidos();
  }

  /**
   * REEMPLAZO: Ahora carga desde la Base de Datos PostgreSQL
   */
  cargarPedidos() {
    this.pedidoService.getPedidos().subscribe({
      next: (data) => {
        this.pedidos = data;
        console.log('Pedidos sincronizados con Postgres');
      },
      error: (err) => console.error('Error al traer pedidos de la DB', err)
    });
  }

  /**
   * ASIGNACIÓN CONECTADA A LA API
   */
  abrirAsignacion(pedido: any) {
    // 1. Identificamos la categoría (ahora desde 'detalles' que es como viene de Java)
    const categoriaServicio = pedido.detalles[0]?.nombreItem || '';

    // 2. Buscamos técnicos reales en la DB por especialidad
    this.usuarioService.getTecnicosPorEspecialidad(categoriaServicio).subscribe({
      next: (tecnicos) => {
        // 3. Filtramos el primero disponible
        const tecnicoAsignado = tecnicos.find(t => t.disponible === true);

        if (tecnicoAsignado) {
          // 4. Actualizamos el objeto pedido con los datos del técnico real
          pedido.tecnico = `${tecnicoAsignado.nombre} ${tecnicoAsignado.apellido}`;
          pedido.estado = 'EN_PROCESO';

          // 5. ENVIAMOS LA ACTUALIZACIÓN A JAVA (PUT)
          // Asumiendo que tienes un método postPedido o putPedido en tu service
          this.pedidoService.postPedido(pedido).subscribe({
            next: () => {
              alert(`¡Asignado! Técnico: ${tecnicoAsignado.nombre} (${tecnicoAsignado.especialidad})`);
              this.cargarPedidos(); // Refrescamos la tabla desde la DB
            },
            error: (err) => console.error('Error al actualizar pedido en DB', err)
          });

        } else {
          alert('No hay técnicos disponibles en PostgreSQL para esta especialidad.');
        }
      },
      error: (err) => console.error('Error al conectar con UsuarioService', err)
    });
  }
}