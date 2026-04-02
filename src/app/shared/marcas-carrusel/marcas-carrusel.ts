import { Component } from '@angular/core';

@Component({
  selector: 'app-marcas-carrusel',
  imports: [],
  templateUrl: './marcas-carrusel.html',
  styleUrl: './marcas-carrusel.css',
})
export class MarcasCarrusel {
  marcas = [
    { 
      id: 1, 
      nombre: 'Bosch', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/1/16/Bosch-logo.svg', 
      link: 'https://www.bosch-home.com' 
    },
    { 
      id: 2, 
      nombre: 'Carrier', 
      logo: 'https://www.carrier.com.ar/wp-content/themes/carrier-responsive-2016/images/carrier-logo.png', 
      link: 'https://www.carrier.com' 
    },
    { 
      id: 3, 
      nombre: 'Yale', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e3/Yale-empresa.jpg', 
      link: 'https://www.yalehome.com' 
    },
    { 
      id: 4, 
      nombre: 'Pinturas Condor', 
      logo: 'https://images.seeklogo.com/logo-png/34/2/pinturas-condor-logo-png_seeklogo-346395.png', 
      link: 'https://www.pinturascondor.com.ec' 
    },
    { 
      id: 5, 
      nombre: 'Philips Hue', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Philips_Hue_logo.svg/3840px-Philips_Hue_logo.svg.png', 
      link: 'https://www.philips-hue.com' 
    },
    { 
      id: 6, 
      nombre: 'Schneider Electric', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/9/95/Schneider_Electric_2007.svg', 
      link: 'https://www.se.com' 
    },
    { 
      id: 7, 
      nombre: 'Hikvision', 
      logo: 'https://mirayconsulting.com/wp-content/uploads/2024/11/Hikvision.png', 
      link: 'https://www.hikvision.com' 
    },
    { 
      id: 8, 
      nombre: 'Rotoplas', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Logo_de_Rotoplas.svg', 
      link: 'https://rotoplas.com.ec' 
    },
    { 
      id: 9, 
      nombre: 'Eternit', 
      logo: 'https://muchomejorecuador.org.ec/wp-content/uploads/2024/10/logo-eternit.png', 
      link: 'https://www.eternit.com.ec' 
    }
  ];

}
