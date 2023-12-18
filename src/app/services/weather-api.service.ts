import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WeatherData } from '../classes/weather-data';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherAPIService {

  constructor(private http: HttpClient) { }

  /**
   * * Retrieves weather forecast data from a given endpoint.
   */
  public getWeatherData(endpoint: string): Observable<WeatherData> {
    const weatherData = this.http.get(`https://api.weather.gov/gridpoints/${endpoint}/31,80/forecast`) as Observable<WeatherData>
    return weatherData
  }

}

