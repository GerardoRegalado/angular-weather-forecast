import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { WeatherComponent } from './components/weather/weather.component';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  { path: 'weather/:location', component: WeatherComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
