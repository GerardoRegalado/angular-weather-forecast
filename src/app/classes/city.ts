import { Forecast } from "./forecast";
import { WeatherData } from "./weather-data";

export class City {
  public name: string; //* declaring a public property to save the city name.
  public endpoint: string; //* Declaring endpoint to request data.
  public data: WeatherData; //* Declaring a new instance of WeatherData class.
  public forecast: Forecast[]; //* Declarong a new instance of Forecast class

  constructor(name: string, endpoint: string, data: WeatherData, forecast: Forecast[]) {
    this.name = name;
    this.endpoint = endpoint;
    this.data = data;
    this.forecast = forecast
  }
}

