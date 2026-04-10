import { Component, inject, computed, ViewChild, ElementRef, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { CarritoService } from '../../services/carrito';
import { PedidoService } from '../../services/pedido';
import { UsuarioService } from '../../services/usuario-service';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-carrito-detalle',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './carrito-detalle.html'
})
export class CarritoDetalle {
  public carritoService = inject(CarritoService);
  private pedidoService = inject(PedidoService);
  private usuarioService = inject(UsuarioService);
  private authService = inject(AuthService);
  private router = inject(Router);

  @ViewChild('fechaInput') fechaInput?: ElementRef<HTMLInputElement>;

  public tecnicoSugerido = signal<any>(null);

  constructor() {
    // Monitoreo constante del carrito
    effect(() => {
      const items = this.carritoService.items();
      const servicio = items.find(item => item.categoria || item.tipo === 'servicio');
      
      if (servicio) {
        const categoria = servicio.categoria || '';
        const categoriaOriginal = servicio.categoria || '';
const categoriaFormateada = categoriaOriginal.charAt(0).toUpperCase() + categoriaOriginal.slice(1).toLowerCase();

this.usuarioService.getTecnicosPorEspecialidad(categoriaFormateada).subscribe({
          next: (tecnicos) => {
            // Buscamos técnico disponible (usando 'disponible' en minúsculas como tu DB)
            const disponible = tecnicos.find(t => t.disponible === true);
            this.tecnicoSugerido.set(disponible || null);
          },
          error: (err) => console.error("Error buscando técnico sugerido", err)
        });
      } else {
        this.tecnicoSugerido.set(null);
      }
    });
  }

  // --- LÓGICA DE FACTURACIÓN ---
  total = computed(() => {
    return this.carritoService.items().reduce((acc, item) => acc + (item.precio || 0), 0);
  });

  subtotal = computed(() => this.total() / 1.12);
  iva = computed(() => this.total() - this.subtotal());

  esServicioTecnico = computed(() => {
    return this.carritoService.items().some(item => item.categoria || item.tipo === 'servicio');
  });

  eliminar(index: number) {
    this.carritoService.quitar(index);
  }

  vaciar() {
    if (confirm('¿Estás seguro de vaciar el carrito?')) {
      this.carritoService.items.set([]);
    }
  }

  confirmarPedido() {
    const usuario = this.authService.usuarioLogueado();

    if (!usuario) {
      alert('Debes iniciar sesión para finalizar la compra.');
      this.router.navigate(['/login']);
      return;
    }

    const fechaAgendada = this.fechaInput?.nativeElement.value;
    if (this.esServicioTecnico() && !fechaAgendada) {
      alert('Por favor, selecciona una fecha y hora para la visita.');
      return;
    }

    const procesarEnvio = (tecnicoReal: any = null) => {
      // AJUSTE CLAVE: Concatenamos nombre y apellido según tu tabla PostgreSQL
      const nombreCompletoTecnico = tecnicoReal 
        ? `${tecnicoReal.nombre} ${tecnicoReal.apellido}` 
        : 'No requiere';

      const nuevoPedido = {
        cliente: { id: Number(usuario.id) },
        tecnicoNombre: nombreCompletoTecnico,
        tecnicoId: tecnicoReal ? Number(tecnicoReal.id) : null,
        detalles: this.carritoService.items().map(item => ({
          itemId: item.id.toString(),
          nombreItem: item.nombre || item.titulo,
          precioUnitario: item.precio,
          cantidad: 1
        })),
        subtotal: this.subtotal(),
        iva: this.iva(),
        total: this.total(),
        fechaAgenda: fechaAgendada || new Date().toISOString(),
        estado: this.esServicioTecnico() ? 'EN_PROCESO' : 'COMPLETADO',
        metodoPago: 'Transferencia Directa'
      };

      this.pedidoService.postPedido(nuevoPedido).subscribe({
        next: () => {
          alert('¡Pedido registrado con éxito en SoluHome!');
          this.carritoService.limpiar();
          this.router.navigate(['/perfil']); // Te sugiero mandar al perfil para que vea su pedido
        },
        error: (err) => {
          console.error("Error al guardar en PostgreSQL", err);
          alert("Error al procesar el pedido. Verifica la conexión con el servidor.");
        }
      });
    };

    procesarEnvio(this.tecnicoSugerido());
  }
}