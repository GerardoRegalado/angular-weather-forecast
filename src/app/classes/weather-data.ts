import { Forecast } from "./forecast";

//* defining the structure of the geometry of a weather data.
interface iGeometry {
  type: string;
  coordinates: [];
}

//* defines the structure of the properties of a weather data object.
interface iProperties {
  updated: string;
  units: string
  forecastGenerator: string;
  generatedAt: string;
  updateTime: string;
  validTimes: string;
  elevation: {
      unitCode: string;
      value: number;
    }
  periods: Forecast[] //* Periods of weather forecast that extends for the next 7 days

}
export interface combinedTemperatures {
  day: string;
  temperatures: number[];
}

export class WeatherData {
  public context: string[] = []; //* saves the context string array
  public type: string = ''; //* Saves the type string
  public geometry: iGeometry; //* Includes data such type and coordinates
  public properties: iProperties //* Properties of the forecast

  constructor() {
    this.geometry = { type: '', coordinates: [] };
    this.properties = {
      updated: '',
      units: '',
      forecastGenerator: '',
      generatedAt: '',
      updateTime: '',
      validTimes: '',
      elevation: {
        unitCode: '',
        value: 0,
      },
      periods: []
    };
  }
}

