import { Component, inject , signal} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgClass } from "../../../../node_modules/@angular/common/types/_common_module-chunk";
import { AuthService } from '../../services/auth-service';
import { RouterLink} from '@angular/router';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
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
      this.authService.login(this.email, this.password).subscribe({
        next: (success) => {
          if (success) {
            // Alerta de bienvenida nítida
            alert('¡Bienvenido a SoluHome!');
            
            // REDIRECCIÓN: Te lleva directo al feature de usuario
            this.router.navigate(['/usuario']); 
          } else {
            alert('Correo o contraseña incorrectos. Revisa los bordes azules.');
          }
        },
        error: (err) => {
          console.error('Error en el login:', err);
          alert('Error de conexión con el servidor.');
        }
      });
    }
  }
}
