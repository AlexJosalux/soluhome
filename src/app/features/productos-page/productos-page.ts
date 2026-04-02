import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Productoshome } from '../../shared/productoshome/productoshome';
import { ProductoService } from '../../services/producto'; // Importación según tu imagen
import { Producto } from '../../models/producto';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-productos-page',
  standalone: true,
  imports: [CommonModule, Productoshome], 
  templateUrl: './productos-page.html',
  styleUrl: './productos-page.css'
})
export class ProductosPage implements OnInit {
  productos$!: Observable<Producto[]>; 

  constructor(private productoSrv: ProductoService) {}

  ngOnInit(): void {
    // Solo asignamos el flujo, no nos suscribimos manualmente
    this.productos$ = this.productoSrv.getProductos();
  }
}