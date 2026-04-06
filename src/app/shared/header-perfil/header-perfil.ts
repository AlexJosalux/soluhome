import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header-perfil',
  imports: [  CommonModule],
  templateUrl: './header-perfil.html',
  styleUrl: './header-perfil.css',
})
export class HeaderPerfil {
  @Input() user: any; // Recibe el usuario desde el componente padre (Perfil)
  private router = inject(Router);

  logout() {
    localStorage.removeItem('user_session');
    this.router.navigate(['/login']);
  }

}
