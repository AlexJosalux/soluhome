import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { Servicio } from '../../models/servicio';
import { DataService } from '../../services/data-servicios';

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './servicios.html',
  styleUrl: './servicios.css',
})
export class Servicios {
listaServicios: Servicio[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.getServicios().subscribe(data => {
      this.listaServicios = data;
    });
  }

  seleccionarServicio(servicio: Servicio) {
    console.log('Servicio añadido al flujo:', servicio.titulo);
    // Aquí disparas la lógica del carrito o agendamiento
  }
}