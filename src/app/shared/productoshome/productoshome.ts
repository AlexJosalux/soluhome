import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Producto } from '../../models/producto';

@Component({
  selector: 'app-productoshome', 
  standalone: true,
  imports: [CommonModule],
  templateUrl: './productoshome.html', 
  styleUrl: './productoshome.css'
})
export class Productoshome {
  @Input() listaProductos: Producto[] = []; 
}