import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WeatherAPIService {
  private locationRouteAPI = "https://freegeoip.app.json/"

  constructor() { }

  async getLocationData() {
    const response = await fetch(this.locationRouteAPI);
    return await response.json();
    }
    async getWeatherData (longitude: string, latitude: string) {
    const response = await fetch(`http://www.7timer.info/bin/civillight.php?lon=${longitude} &lat=${latitude}&ac=8&unit-metric&output=json`);
    return await response.json();
    }
}
