import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-producto-card',
  imports: [],
  templateUrl: './producto-card.html',
  styleUrl: './producto-card.css',
})
export class ProductoCard {
  @Input() producto: any;
  @Input() productoAnadidoId: number | null = null;
  
  @Output() clickCard = new EventEmitter<any>();
  @Output() añadirCarrito = new EventEmitter<{event: Event, producto: any}>();

  onCardClick() {
    this.clickCard.emit(this.producto);
  }

  onAdd(event: Event) {
    event.stopPropagation(); // Evita que se abra el modal al hacer clic en el botón
    this.añadirCarrito.emit({ event, producto: this.producto });
  }
}

