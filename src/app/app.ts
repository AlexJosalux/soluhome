import { Component, computed, inject, signal, effect } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { NavBar } from './shared/nav-bar/nav-bar';
import { HomePage } from './features/home-page/home-page';
import { Footer } from "./shared/footer/footer";
import { ConsultasPage } from './features/consultas-page/consultas-page';
import { CarritoService } from './services/carrito-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true, // Asegúrate de que sea standalone si usas imports directos
  imports: [RouterOutlet, NavBar, HomePage, Footer, ConsultasPage],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private carritoService = inject(CarritoService);
  private router = inject(Router);

  // 1. Detectamos los cambios de ruta para que el Signal se refresque
  private routeSignal = toSignal(
    this.router.events.pipe(filter(event => event instanceof NavigationEnd))
  );

  // 2. Cantidad de items reactiva
  cantidadItems = computed(() => this.carritoService.items().length);

  // 3. Lógica para mostrar/ocultar el botón
  mostrarBotonFlotante = computed(() => {
    // Al incluir routeSignal(), este computed se ejecutará cada vez que navegues
    this.routeSignal(); 

    // Verificamos sesión (clave 'user' de Jose Vargas)
    const session = localStorage.getItem('user');
    const hayUsuario = !!session; 
    
    const hayProductos = this.cantidadItems() > 0;
    const urlActual = this.router.url;
    const enPaginaPedidos = urlActual.includes('/usuario') || urlActual.includes('/perfil') || urlActual.includes('/carrito');

    // El botón se elimina si: NO hay usuario OR NO hay productos OR ya estamos viendo el pedido
    return hayUsuario && hayProductos && !enPaginaPedidos;
  });

  irAPedidos() {
    // Redirigimos al carrito o al perfil según prefieras
    this.router.navigate(['/carrito']); 
  }
}