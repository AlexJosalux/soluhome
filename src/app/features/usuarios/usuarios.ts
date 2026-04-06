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

  // Creamos un Signal computado para obtener el perfil actual
  public perfil = computed(() => this.authService.usuarioLogueado());

  // Creamos señales booleanas para usar en el HTML con @if
  public esAdmin = computed(() => this.perfil()?.rol === 'admin');
  public esTecnico = computed(() => this.perfil()?.rol === 'tecnico');
  public esCliente = computed(() => this.perfil()?.rol === 'cliente');

  /**
   * Método para cerrar sesión y limpiar el sistema
   */
  cerrarSesion() {
    this.authService.logout();
  }
}