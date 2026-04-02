import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Servicio } from '../models/servicio';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  // Si es local: 'assets/data/servicios.json'
  // Si es API: 'https://tu-api.com/servicios'
  private jsonUrl = 'https://69c87cc068edf52c954dcc08.mockapi.io/api/soluhome/servicios'; 

  constructor(private http: HttpClient) {}

  getServicios(): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(this.jsonUrl);
  }

  // Método para actualizar el precio post-reparación (Edición)
  updatePrecioPost(id: string, nuevoPrecio: number): Observable<any> {
    return this.http.put(`${this.jsonUrl}/${id}`, { precioPost: nuevoPrecio });
  }
}