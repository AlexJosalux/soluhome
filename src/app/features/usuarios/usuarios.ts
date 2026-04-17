import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Perfil } from '../../shared/perfil/perfil';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, Perfil],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css',
})
export class Usuarios {
  // Inyectamos el servicio de autenticación para obtener los datos
  public authService = inject(AuthService);

  // Obtenemos el perfil desde el signal del servicio
public perfil = computed(() => this.authService.usuarioLogueado());

// Comparamos con los valores EXACTOS de tu interfaz Usuarios
public esAdmin = computed(() => this.perfil()?.rol === 'ROLE_ADMIN');
public esTecnico = computed(() => this.perfil()?.rol === 'ROLE_TECNICO');
public esCliente = computed(() => this.perfil()?.rol === 'ROLE_CLIENTE');

  /**
   * Método para cerrar sesión y limpiar el sistema
   */
  cerrarSesion() {
    this.authService.logout();
  }
}