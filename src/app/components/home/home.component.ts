import { Component, OnInit } from '@angular/core';
import { WeatherAPIService } from '../../services/weather-api.service';

@Component({
  selector: 'awf-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  public cities = [
    { name: 'Kansas', endpoint: 'TOP', data: {}, forecast: []},
    { name: 'District of Columbia', endpoint: 'LWX', data: {}, forecast: []}
  ];
  constructor(public weatherService: WeatherAPIService){}
  ngOnInit(): void {
    this.cities.forEach(city => {
      this.weatherService.getWeatherData(city.endpoint).subscribe(data => {
        city.data = data;
      });
    });
  }



}
