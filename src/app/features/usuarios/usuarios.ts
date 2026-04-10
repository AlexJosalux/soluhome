import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Perfil } from '../../shared/perfil/perfil';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, Perfil],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css',
})
export class Usuarios {
  public authService = inject(AuthService);
  private router = inject(Router);

  public perfil = computed(() => this.authService.usuarioLogueado());

  /**
   * SOLUCIÓN AL ERROR DE COMPARACIÓN:
   * Usamos 'as string' para decirle a TypeScript que confíe en nosotros,
   * ya que el valor viene de la base de datos PostgreSQL.
   */
  public esAdmin = computed(() => {
    const rol = this.perfil()?.rol as string;
    return rol === 'admin' || rol === 'ROLE_ADMIN';
  });
  
  public esTecnico = computed(() => {
    const rol = this.perfil()?.rol as string;
    return rol === 'tecnico' || rol === 'ROLE_TECNICO';
  });
  
  public esCliente = computed(() => {
    const rol = this.perfil()?.rol as string;
    return rol === 'cliente' || rol === 'ROLE_CLIENTE';
  });

  cerrarSesion() {
    this.authService.logout();
    this.router.navigate(['/home'])
    
  }
} 