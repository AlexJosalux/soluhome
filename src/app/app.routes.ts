import { Routes } from '@angular/router';
import { HomePage } from './features/home-page/home-page';
import { NosotrosPage } from './features/nosotros-page/nosotros-page';
import { ConsultasPage } from './features/consultas-page/consultas-page';
import { Login } from './shared/login/login';
import { Servicios } from './shared/servicios/servicios';
import { ServiciosPage } from './features/servicios-page/servicios-page';
import { ProductosPage } from './features/productos-page/productos-page';
import { Registro } from './shared/registro/registro';
import { Usuarios } from './features/usuarios/usuarios';




export const routes: Routes = [
    {path:'',component: HomePage},
    {path:'nosotros', component:NosotrosPage},
    {path:'consultas', component: ConsultasPage, 
    canMatch: []},
    {path:'servicios', component: ServiciosPage},
    {path:'productos', component: ProductosPage},
    {path:'usuario', component: Usuarios},
    {path: 'login', component: Login},
    {path: 'registro', component: Registro }

];