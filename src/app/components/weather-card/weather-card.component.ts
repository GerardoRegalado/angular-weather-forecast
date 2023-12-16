import { Component, Input } from '@angular/core';

@Component({
  selector: 'awf-weather-card',
  templateUrl: './weather-card.component.html',
  styleUrl: './weather-card.component.scss'
})
export class WeatherCardComponent {
  public todayTmp: any
  public tmpUnits: any
  public detailedForecast: any;
  public shortForecast: any;
  public windSpeed: any
  public windDirection: any;
  public image: any;
  public isDayTime = true
  public relativeHumidity: any
  public name:any
  @Input() weatherData: any;
  @Input() cityName: string = '';

  ngOnInit(): void {
    console.log(this.weatherData.properties?.periods)
    this.initializeValues()
  }

  public initializeValues() {
    this.todayTmp = this.weatherData.properties?.periods[0].temperature
    this.tmpUnits = this.weatherData.properties?.periods[0].temperatureUnit
    this.detailedForecast = this.weatherData.properties?.periods[0].detailedForecast
    this.shortForecast = this.weatherData.properties?.periods[0].shortForecast
    this.windSpeed = this.weatherData.properties?.periods[0].windSpeed
    this.windDirection = this.weatherData.properties?.periods[0].windDirection
    this.image = this.weatherData.properties?.periods[0].icon
    this.isDayTime = this.weatherData.properties?.periods[0].isDayTime
    this.relativeHumidity = this.weatherData.properties?.periods[0].relativeHumidity
    this.name = this.weatherData.properties?.periods[0].name

  }
}
