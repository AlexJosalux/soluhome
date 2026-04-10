import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PedidoService {
  private http = inject(HttpClient);
  
  // URL de tu API de Spring Boot (PostgreSQL)
  private API_PEDIDOS = 'http://localhost:8080/api/pedidos';

  /**
   * Envía el objeto completo (Cabecera + Detalles) a Java
   */
  postPedido(pedido: any): Observable<any> {
    return this.http.post<any>(this.API_PEDIDOS, pedido);
  }

  /**
   * Trae todos los pedidos de la base de datos
   */
  getPedidos(): Observable<any[]> {
    return this.http.get<any[]>(this.API_PEDIDOS);
  }

  /**
   * Trae un pedido por su código (ej: SOLU-9921)
   */
  getPedidoById(id: string): Observable<any> {
    return this.http.get<any>(`${this.API_PEDIDOS}/${id}`);
  }
}