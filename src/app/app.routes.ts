import { Routes } from '@angular/router';
import { HomePage } from './features/home-page/home-page';
import { NosotrosPage } from './features/nosotros-page/nosotros-page';
import { ConsultasPage } from './features/consultas-page/consultas-page';
import { Login } from './shared/login/login';
import { ServiciosPage } from './features/servicios-page/servicios-page';
import { ProductosPage } from './features/productos-page/productos-page';
import { Registro } from './shared/registro/registro';
import { Usuarios } from './features/usuarios/usuarios';
import { CarritoDetalle } from './features/carrito-detalle/carrito-detalle';
import { roleGuard } from './guards/role-guard';
import { Perfil } from './shared/perfil/perfil';
import { candeactivateGuard } from './guards/candeactivate-guard'; 

export const routes: Routes = [
    { path: '', component: HomePage },
    { path: 'nosotros', component: NosotrosPage },
    { path: 'consultas', component: ConsultasPage },
    { path: 'servicios', component: ServiciosPage },
    { path: 'productos', component: ProductosPage },
    { path: 'carrito',  component: CarritoDetalle,
        canActivate: [roleGuard], 
        // Se activa cuando el usuario intenta SALIR de la ruta 'carrito'
        canDeactivate: [candeactivateGuard], 
        data: { roles: ['cliente', 'Cliente', 'CLIENTE'] } 
    },
    { path: 'usuario', component: Usuarios },
    { path: 'login', component: Login },
    { path: 'registro', component: Registro },
    { path: 'perfil',    component: Perfil, 
        canActivate: [roleGuard], 
        data: { roles: ['cliente', 'tecnico', 'admin'] }
    }
];