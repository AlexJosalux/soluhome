import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private http = inject(HttpClient);

  private API_USUARIOS = 'https://soluhome-2a5d9-default-rtdb.firebaseio.com/';


  //Metodo GET
  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<{ [key: string]: Usuario }>(`${this.API_USUARIOS}/users.json`).pipe(
      map(response => {
        if (!response) {
          return [];
        }
        return Object.keys(response).map(id => {
          const usuarioConId = { ...response[id], id: id };
          return usuarioConId
        })
      })
    )
  }

  //Metodo POST
  postUsuario(usuario: Usuario):Observable<Usuario>{
    return this.http.post<Usuario>(`${this.API_USUARIOS}/users.json`, usuario);
  }

  //Metodo PUT
  putUsuario(id: string, usuario: Usuario): Observable<Usuario>{
    return this.http.put<Usuario>(`${this.API_USUARIOS}/users/${id}.json`, usuario);
  }

  //Metodo PUT
  deleteUsuario(id: string): Observable<Usuario>{
    return this.http.delete<Usuario>(`${this.API_USUARIOS}/users/${id}.json`);
  }
  // Agrega este método dentro de tu UsuarioService
getUsuarioById(id: string): Observable<Usuario> {
  return this.http.get<Usuario>(`${this.API_USUARIOS}/users/${id}.json`).pipe(
    map(res => ({ ...res, id }))
  );
}
}
