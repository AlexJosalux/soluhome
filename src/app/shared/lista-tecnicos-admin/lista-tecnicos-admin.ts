import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../services/usuario-service'; // Asegúrate de tener este servicio

@Component({
  selector: 'app-lista-tecnicos-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lista-tecnicos-admin.html',
  styleUrl: './lista-tecnicos-admin.css',
})
export class ListaTecnicosAdmin implements OnInit {
  private usuarioService = inject(UsuarioService);
  public tecnicos: any[] = [];

  ngOnInit() {
    this.cargarTecnicosDesdeDB();
  }

  // Ahora llamamos a la base de datos real
  cargarTecnicosDesdeDB() {
    this.usuarioService.getUsuarios().subscribe({
      next: (usuarios) => {
        // Filtramos por el rol 'tecnico' que viene de PostgreSQL
        this.tecnicos = usuarios.filter((u: any) => u.rol === 'tecnico');
      },
      error: (err) => console.error("Error al obtener técnicos de la DB", err)
    });
  }

  // Cambiar disponibilidad directamente en PostgreSQL
  toggleEstado(tecnico: any) {
    const nuevoEstado = !tecnico.disponible;
    // Llamamos al servicio para actualizar en el Backend
    this.usuarioService.actualizarDisponibilidad(tecnico.id, nuevoEstado).subscribe({
      next: () => {
        tecnico.disponible = nuevoEstado; // Actualizamos la vista
      },
      error: (err) => alert("No se pudo cambiar el estado en el servidor")
    });
  }
}