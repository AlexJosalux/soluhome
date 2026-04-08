import { Component, inject, computed, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { CarritoService } from '../../services/carrito';

@Component({
  selector: 'app-carrito-detalle',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './carrito-detalle.html'
})
export class CarritoDetalle {
  // Inyección de servicios
  public carritoService = inject(CarritoService);
  private router = inject(Router);

  // Referencia al input de fecha en el HTML (#fechaInput)
  @ViewChild('fechaInput') fechaInput?: ElementRef<HTMLInputElement>;

  // --- LÓGICA DE FACTURACIÓN: IVA INCLUIDO (TALLER 2) ---

  /**
   * 1. Total Final: Es la suma directa de los precios (ya incluyen IVA).
   */
  total = computed(() => {
    return this.carritoService.items().reduce((acc, item) => acc + (item.precio || 0), 0);
  });

  /**
   * 2. Subtotal (Base Imponible): Se extrae dividiendo el total para 1.12.
   */
  subtotal = computed(() => {
    return this.total() / 1.12;
  });

  /**
   * 3. IVA (12%): Es la diferencia entre el total pagado y la base imponible.
   */
  iva = computed(() => {
    return this.total() - this.subtotal();
  });

  // -------------------------------------------------

  // Detecta si hay servicios técnicos en el carrito para mostrar el calendario
  esServicioTecnico = computed(() => {
    return this.carritoService.items().some(item => 
      item.tipo === 'servicio' || item.tecnico
    );
  });

  eliminar(index: number) {
    this.carritoService.quitar(index);
  }

  vaciar() {
    if(confirm('¿Estás seguro de vaciar el carrito?')) {
      this.carritoService.items.set([]);
    }
  }

  /**
   * FUNCIÓN DE APOYO PARA ASIGNACIÓN AUTOMÁTICA
   */
  private buscarTecnicoAutomatico(categoriaServicio: string): any {
    const usuariosRaw = localStorage.getItem('usuarios_db') || '[]';
    const listaTecnicos = JSON.parse(usuariosRaw).filter((u: any) => u.rol === 'tecnico');

    if (listaTecnicos.length === 0) return null;

    // Intenta buscar por coincidencia de especialidad
    const match = listaTecnicos.find((t: any) => 
      t.disponible && (categoriaServicio?.includes(t.especialidad) || t.especialidad?.includes(categoriaServicio))
    );

    // Si no hay match, retorna el primero disponible
    return match || listaTecnicos.find((t: any) => t.disponible) || listaTecnicos[0];
  }

  confirmarPedido() {
    // 1. OBTENER SESIÓN
    const session = localStorage.getItem('user') || 
                    localStorage.getItem('usuario') || 
                    localStorage.getItem('user_session');
    
    let clienteData = { id: 'invitado', nombre: 'Cliente Invitado' };

    if (session) {
      try {
        const userParsed = JSON.parse(session);
        clienteData.id = userParsed.uid || userParsed.id || userParsed.localId || 'invitado';
        clienteData.nombre = userParsed.nombre || userParsed.displayName || 'Cliente SoluHome';
      } catch (e) {
        console.error("Error al procesar la sesión:", e);
      }
    }

    if (clienteData.id === 'invitado' && session) {
        console.warn("Se detectó sesión pero no se pudo extraer un ID válido.");
    }

    // 2. CAPTURAR FECHA (Solo si es servicio técnico)
    const fechaAgendada = this.fechaInput?.nativeElement.value;

    if (this.esServicioTecnico() && !fechaAgendada) {
      alert('Por favor, selecciona una fecha y hora para que nuestro técnico pueda visitarte.');
      return;
    }

    // --- LÓGICA DE ASIGNACIÓN CONDICIONAL ---
    let tecnicoAsignado = null;
    if (this.esServicioTecnico()) {
      const primeraCategoria = this.carritoService.items()[0]?.categoria || '';
      tecnicoAsignado = this.buscarTecnicoAutomatico(primeraCategoria);
    }
    // ---------------------------------------------------------

    // 3. ESTRUCTURA DEL PEDIDO
    const ahora = new Date().toISOString(); 

    const nuevoPedido = {
      id: 'SOLU-' + Math.random().toString(36).substring(2, 7).toUpperCase(),
      clienteId: clienteData.id,
      clienteNombre: clienteData.nombre,
      
      tecnico: tecnicoAsignado ? tecnicoAsignado.nombre : null,
      tecnicoId: tecnicoAsignado ? tecnicoAsignado.id : null,
      
      items: [...this.carritoService.items()],
      
      // VALORES DE FACTURACIÓN (Taller 2 - Desglose de IVA Incluido)
      subtotal: this.subtotal(),
      iva: this.iva(),
      total: this.total(), 
      
      createdAt: ahora,             
      updatedAt: ahora,             
      metodoPago: 'Transferencia Directa', 
      
      fecha: ahora,                 
      fechaAgenda: fechaAgendada || null,
      tipo: this.esServicioTecnico() ? 'SERVICIO_TECNICO' : 'SOLO_PRODUCTO',
      
      estado: this.esServicioTecnico() ? (tecnicoAsignado ? 'EN_PROCESO' : 'PENDIENTE') : 'COMPLETADO'
    };

    // 4. GUARDAR EN LA BASE DE DATOS LOCAL
    try {
      const pedidosDB = JSON.parse(localStorage.getItem('pedidos_db') || '[]');
      pedidosDB.push(nuevoPedido);
      localStorage.setItem('pedidos_db', JSON.stringify(pedidosDB));

      // 5. FINALIZAR CON ALERTA
      if (nuevoPedido.tecnico) {
        alert(`¡Excelente! Pedido registrado. Especialista asignado: ${nuevoPedido.tecnico}`);
      } else {
        alert(`¡Excelente! Pedido registrado.`);
      }
      
      // Limpiamos el carrito
      this.carritoService.items.set([]);
      
      // NAVEGACIÓN
      this.router.navigate(['/usuario']).then(nav => {
        if(!nav) {
            this.router.navigate(['/perfil']);
        }
      });
      
    } catch (error) {
      console.error("Error al guardar el pedido:", error);
      alert("Hubo un problema al procesar tu pedido.");
    }
  }
}