interface Precipitation {
  unitCode: string;
  value: null;
}

interface Dewpoint {
  unitCode: string;
  value: number;
}

interface Humidity {
  unitCode: string;
  value: number;
}

export class Forecast {
  public number: number = 0;
  public name: string = '';
  public startTime: string = '';
  public endTime: string = '';
  public isDaytime: boolean = true;
  public temperature: number = 0;
  public temperatureUnit: string = '';
  public temperatureTrend: null = null;
  public probabilityOfPrecipitation!: Precipitation
  public dewpoint!: Dewpoint;
  public relativeHumidity!: Humidity
  public windSpeed: string = '';
  public windDirection: string = '';
  public icon: string = '';
  public shortForecast: string = '';
  public detailedForecast: string = '';
}
