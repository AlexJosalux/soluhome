import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { CommonModule } from '@angular/common'; // Agregamos CommonModule para directivas básicas
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  // Es vital incluir CommonModule para que las clases dinámicas de Tailwind funcionen
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.css',
})
export class NavBar {
  // Cambiamos a 'public' para que el HTML pueda leer el estado del usuario
  public authService = inject(AuthService);
  
  isMenuOpen = false; 
  routerLinkActiveOptions = { exact: true };

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  cerrarSesion() {
    this.authService.logout();
    this.isMenuOpen = false;
    // No es necesario window.location.href si el servicio ya tiene el router.navigate
  }
}