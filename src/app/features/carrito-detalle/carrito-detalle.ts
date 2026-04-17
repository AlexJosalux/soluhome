import { Component, inject, computed, signal, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CarritoService } from '../../services/carrito-service';
import { PedidosService } from '../../services/pedidos-service';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-carrito-detalle',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './carrito-detalle.html',
  styleUrl: './carrito-detalle.css'
})
export class CarritoDetalle {
  public carritoService = inject(CarritoService);
  private pedidosService = inject(PedidosService);
  private authService = inject(AuthService);
  private router = inject(Router);

  @ViewChild('fechaInput') fechaInput!: ElementRef;

  public cargando = signal<boolean>(false);
  items = this.carritoService.items;
  total = this.carritoService.totalCarrito;

  subtotal = computed(() => this.total() / 1.12);
  iva = computed(() => this.total() - this.subtotal());

  esServicioTecnico = computed(() => {
    return this.items().some(item => 
      item.tipo?.toString().toUpperCase() === 'SERVICIO'
    );
  });

  actualizarCantidad(id: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const nuevaCantidad = parseInt(input.value, 10);
    if (!isNaN(nuevaCantidad)) {
      this.carritoService.actualizarCantidad(id, nuevaCantidad);
    }
  }

  eliminar(id: number, tipo: string): void {
    // Se mantiene la firma con 'tipo' para evitar errores TS2554 en el HTML
    this.carritoService.eliminarItem(id); 
  }

  vaciar(): void {
    if (confirm('¿Estás seguro de que deseas vaciar el carrito?')) {
      this.carritoService.vaciarCarrito();
    }
  }

  confirmarPedido(): void {
    const usuario = this.authService.usuarioLogueado();
    const fechaSeleccionada = this.fechaInput?.nativeElement?.value;

    if (!usuario || !usuario.id) {
      alert('Debes iniciar sesión para realizar el pedido.');
      this.router.navigate(['/login']);
      return;
    }

    if (this.esServicioTecnico() && !fechaSeleccionada) {
      alert('Por favor, selecciona una fecha para el servicio técnico.');
      return;
    }

    this.cargando.set(true);

    // Estructura de DTO corregida para que el Perfil pueda leer los datos
    const pedidoDto = {
      usuario: { id: usuario.id }, // Para el backend (Spring Boot)
      clienteId: String(usuario.id).trim(), // Para el filtro del Perfil
      clienteNombre: (usuario as any).nombre || 'Cliente SoluHome', // Para mostrar en la lista
      total: this.total(),
      fecha: new Date().toISOString(),
      fechaAgenda: this.esServicioTecnico() ? fechaSeleccionada : null,
      metodoPago: 'TRANSFERENCIA',
      estado: 'PENDIENTE',
      tipo: this.esServicioTecnico() ? 'SERVICIO_TECNICO' : 'PRODUCTO',
      items: this.items().map(item => ({
        id: item.id,
        nombre: item.nombre,
        precio: item.precio,
        cantidad: item.cantidad || 1,
        tipo: item.tipo?.toString().toUpperCase()
      }))
    };

    this.pedidosService.crearPedido(pedidoDto).subscribe({
      next: (res: any) => { 
        this.cargando.set(false);

        // Guardamos en el LocalStorage para que el componente Perfil vea el cambio inmediato
        try {
          const localPedidos = JSON.parse(localStorage.getItem('pedidos_db') || '[]');
          localPedidos.push({ ...pedidoDto, id: res.id || Date.now() });
          localStorage.setItem('pedidos_db', JSON.stringify(localPedidos));
        } catch (e) {
          console.error("Error guardando respaldo local:", e);
        }

        this.carritoService.vaciarCarrito();
        alert('¡Pedido enviado con éxito!');
        this.router.navigate(['/usuarios']); 
      },
      error: (err: any) => {
        this.cargando.set(false);
        console.error('Error al procesar pedido:', err);
        alert('Error al procesar la orden en el servidor.');
      }
    });
  }
}