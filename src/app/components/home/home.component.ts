import { Component, OnInit} from '@angular/core';
import { WeatherAPIService } from '../../services/weather-api.service';
import { City } from '../../classes/city';
import { WeatherData } from '../../classes/weather-data';
import { Subscription, forkJoin } from 'rxjs';

@Component({
  selector: 'awf-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  public cities: City[] = []; //* Created to save each city information
  private subscription: Subscription = new Subscription(); // * Subscription

  constructor(public weatherService: WeatherAPIService){}

  ngOnInit(): void {
    this.initializeValues();
  }

  /**
   * *The function initializes values for cities by creating City objects and fetching weather data for
   * * each city.
   */
  public initializeValues(): void {
    this.cities = [
      new City('Kansas', 'TOP', new WeatherData() , []),
      new City('Columbia', 'LWX',new WeatherData() , [])
    ]
    const observables = this.cities.map(city =>
      this.weatherService.getWeatherData(city.endpoint)
    );
    this.subscription.add(
      forkJoin(observables).subscribe(responses => {
        responses.forEach((data, index) => {
          this.cities[index].data = data as WeatherData;
        });
      })
    );
  }

  /**
   * * Used to unsubscribe from a subscription.
   */
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
