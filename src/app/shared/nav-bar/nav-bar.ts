import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { CommonModule } from '@angular/common'; 
import { AuthService } from '../../services/auth-service';
import { CarritoService } from '../../services/carrito'; // Importación según tu estructura

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.css',
})
export class NavBar {
  // Inyectamos el servicio como público para que el HTML acceda a usuarioLogueado()
  public authService = inject(AuthService);
  public carritoService = inject(CarritoService);
  
  isMenuOpen = false; 
  routerLinkActiveOptions = { exact: true };

  /**
   * Cambia el estado del menú lateral en dispositivos móviles
   */
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  /**
   * Cierra la sesión del usuario a través del servicio 
   * y asegura que el menú móvil se cierre.
   */
  cerrarSesion() {
    // Si tu servicio tiene el método 'logout', lo llamamos aquí
    this.authService.logout(); 
    this.isMenuOpen = false;
  }
}