import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Cambiado: Importación estándar
import { AuthService } from '../../services/auth-service'; // Asegura la ruta correcta
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true, // Asegúrate de que sea standalone
  imports: [CommonModule, FormsModule, RouterLink], // CommonModule es mejor que NgClass directo
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  // Variables vinculadas al formulario
  email = '';
  password = '';

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  iniciarSesion() {
    if (this.email && this.password) {
      // Tu authService ahora devuelve el objeto Usuario desde Spring Boot
      this.authService.login(this.email, this.password).subscribe({
  next: (usuario: any) => { // <--- Cambia el tipo a 'any' aquí
    if (usuario) {
      alert(`¡Bienvenido a SoluHome, ${usuario.nombre}!`);
      this.router.navigate(['/usuario']); 
    } else {
      alert('Credenciales incorrectas.');
    }
        },
        error: (err) => {
          console.error('Error en el login:', err);
          alert('No se pudo conectar con el servidor de Spring Boot. Verifica que el backend esté corriendo.');
        }
      });
    } else {
      alert('Por favor, completa todos los campos.');
    }
  }
}
