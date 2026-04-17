import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Usuarios } from '../../models/usuario';

@Component({
  selector: 'app-lista-tecnicos-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lista-tecnicos-admin.html',
  styleUrl: './lista-tecnicos-admin.css',
})
export class ListaTecnicosAdmin implements OnInit {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8080/api/usuarios';

  // Signal con todos los usuarios de la base de datos
  public usuariosDb = signal<Usuarios[]>([]);

  // Filtro automático: Solo extrae los técnicos para la vista administrativa
  public listaTecnicos = computed(() => 
    this.usuariosDb().filter(u => u.rol === 'ROLE_TECNICO')
  );

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.http.get<Usuarios[]>(this.API_URL).subscribe({
      next: (data) => this.usuariosDb.set(data),
      error: (err) => console.error('Error al conectar con la DB de SoluHome:', err)
    });
  }
}