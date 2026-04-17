import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Usuarios } from '../../models/usuario'; // Tu interfaz corregida

@Component({
  selector: 'app-tabla-gestion-pedidos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabla-gestion-pedidos.html',
  styleUrl: './tabla-gestion-pedidos.css',
})
export class TablaGestionPedidos implements OnInit {
  private http = inject(HttpClient);
  
  // Usamos signals para que la tabla sea reactiva
  public pedidos = signal<any[]>([]);
  private readonly API_URL = 'http://localhost:8080/api';

  ngOnInit() {
    this.cargarPedidos();
  }

  cargarPedidos() {
    // Cambiar esto por tu endpoint de pedidos real en Spring Boot
    this.http.get<any[]>(`${this.API_URL}/pedidos`).subscribe(res => {
      this.pedidos.set(res);
    });
  }

  /**
   * LÓGICA DE ASIGNACIÓN AUTOMÁTICA
   * Se dispara cuando el administrador presiona "Asignar" o cuando entra un pedido nuevo
   */
  ejecutarAsignacionAutomatica(pedido: any) {
    // 1. Traer todos los usuarios para filtrar técnicos
    this.http.get<Usuarios[]>(`${this.API_URL}/usuarios`).subscribe(usuarios => {
      
      const listaTecnicos = usuarios.filter(u => u.rol === 'ROLE_TECNICO');

      // 2. Obtener la categoría del primer servicio del carrito
      const categoriaNecesaria = pedido.items[0]?.categoria;

      // 3. Buscar coincidencia exacta por especialidad
      let tecnicoAsignado = listaTecnicos.find(t => 
        t.especialidad === categoriaNecesaria
      );

      // 4. Fallback: Si no hay de esa especialidad, el primero de la lista (o manejar error)
      if (!tecnicoAsignado) {
        tecnicoAsignado = listaTecnicos[0]; 
      }

      if (tecnicoAsignado) {
        this.confirmarAsignacion(pedido.id, tecnicoAsignado);
      } else {
        alert('No existen técnicos registrados para esta categoría.');
      }
    });
  }

  private confirmarAsignacion(pedidoId: number, tecnico: Usuarios) {
    const payload = {
      tecnicoId: tecnico.id,
      tecnicoNombre: tecnico.nombreCompleto,
      estado: 'EN_PROCESO'
    };

    // 5. Actualizar en la base de datos PostgreSQL a través de Spring Boot
    this.http.put(`${this.API_URL}/pedidos/${pedidoId}/asignar`, payload).subscribe({
      next: () => {
        alert(`Asignación exitosa: ${tecnico.nombreCompleto}`);
        this.cargarPedidos(); // Recargar tabla
      },
      error: () => alert('Error al actualizar el pedido en el servidor')
    });
  }
}