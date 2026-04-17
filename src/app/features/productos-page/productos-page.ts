import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Productoshome } from '../../shared/productoshome/productoshome';
import { ProductoService } from '../../services/producto-service';
import { Producto } from '../../models/producto';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-productos-page',
  standalone: true,
  imports: [CommonModule, Productoshome], 
  templateUrl: './productos-page.html',
  styleUrl: './productos-page.css'
})
export class ProductosPage {

  
}