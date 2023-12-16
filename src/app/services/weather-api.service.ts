import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WeatherAPIService {

  constructor(private http: HttpClient) { }

  public getWeatherData(endpoint: string) {
    const weatherData = this.http.get(`https://api.weather.gov/gridpoints/${endpoint}/31,80/forecast`)
    return weatherData
  }

}

