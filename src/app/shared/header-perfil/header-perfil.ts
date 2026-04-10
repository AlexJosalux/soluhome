import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth-service'; // Inyectar el servicio central

@Component({
  selector: 'app-header-perfil',
  standalone: true, // Asegúrate de que sea standalone
  imports: [CommonModule],
  templateUrl: './header-perfil.html',
  styleUrl: './header-perfil.css',
})
export class HeaderPerfil {
  // Recibe el usuario desde el componente padre (Perfil)
  @Input() user: any; 
  
  private router = inject(Router);
  private authService = inject(AuthService); // Usamos tu servicio de Auth

  /**
   * Método de salida del sistema.
   * Usamos el servicio central para asegurar que se limpie 
   * tanto el LocalStorage como el Signal de sesión.
   */
  logout() {
    this.authService.logout(); 
    // El authService ya debería manejar la redirección, 
    // pero si no, puedes reforzarla aquí:
    this.router.navigate(['/login']);
  }

  /**
   * Helper para mostrar el rol de forma amigable en el HTML
   * Convierte 'ROLE_CLIENTE' en 'Cliente'
   */
  get nombreRol(): string {
    const rol = this.user?.rol as string;
    if (!rol) return 'Usuario';
    
    if (rol.includes('ADMIN')) return 'Administrador';
    if (rol.includes('TECNICO')) return 'Técnico Especialista';
    if (rol.includes('CLIENTE')) return 'Cliente SoluHome';
    
    return rol;
  }
}
