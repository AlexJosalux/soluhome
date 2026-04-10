import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private http = inject(HttpClient);

  private API_USUARIOS = 'http://localhost:8080/api/usuarios';

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.API_USUARIOS);
  }

  getTecnicosPorEspecialidad(especialidad: string): Observable<any[]> {
  // Asegúrate de que la ruta coincida con tu @GetMapping en Java
  return this.http.get<any[]>(`${this.API_USUARIOS}/search/tecnicos`, {
    params: { especialidad: especialidad } 
  });
}

  // --- MÉTODO AGREGADO PARA CORREGIR TU ERROR EN EL COMPONENTE ---
  actualizarDisponibilidad(id: number, disponible: boolean): Observable<any> {
    // Coincide con el @PatchMapping("/{id}/disponibilidad") que sugerimos para Java
    return this.http.patch(`${this.API_USUARIOS}/${id}/disponibilidad`, { disponible });
  }

  getUsuarioById(id: number | string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.API_USUARIOS}/${id}`);
  }

  postUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.API_USUARIOS, usuario);
  }

  putUsuario(id: number | string, usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.API_USUARIOS}/${id}`, usuario);
  }

  deleteUsuario(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.API_USUARIOS}/${id}`);
  }
}