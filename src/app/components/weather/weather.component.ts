import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WeatherAPIService } from '../../services/weather-api.service';
import { Chart, ChartConfiguration, ChartData, ChartType } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { WeatherData, combinedTemperatures } from '../../classes/weather-data';
import { Forecast } from '../../classes/forecast';
import { Subscription } from 'rxjs';

@Component({
  selector: 'awf-weather',
  templateUrl: './weather.component.html',
  styleUrl: './weather.component.scss'
})
export class WeatherComponent implements OnInit {
  public subscription: Subscription = new Subscription(); // * Subscription
  public endpoint: string = ''; //* Saves the endpoint get from the params.
  public title: string = '' //* Used to save the title.
  public completeForecast: WeatherData = new WeatherData() //* Used to save the complete forecast of the week.
  public todayForecast: Forecast = new Forecast() //* Used to save and show the todays data.
  public combinedTemperatures: combinedTemperatures[] = []; //* Used to save the combined day and night temperature.
  public labels: string[] = []; //* used to save the labels that will be shown on the chart

  public lineChartData: ChartConfiguration['data'] = { datasets: [] }; // * Data that is going to be shown on the charts
  public lineChartType: ChartType = 'line'; // * Type of chart
  public lineChartOptions: ChartConfiguration['options'] = {
    // * Custom chart options
    responsive: true,
    interaction: {
      mode: 'point',
      axis: 'x',
      intersect: false,
    },
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'top',
        formatter: (value) => { return value + '°F' },
        color: '#444',
        font : {
          weight: 'normal',
        }
      }
    },
    elements: {
        line: {
            fill: false,
            tension: 0.5,
        },
    },
    scales: {
        x: {
          title: {
            display: true,
            text: 'Day'
          }
        },
        y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Temperature'
            }
        },
    },
};

  constructor(private route: ActivatedRoute, private router: Router, private weatherService: WeatherAPIService) {}

  ngOnInit(): void {
    Chart.register(ChartDataLabels)
    this.gettingIdFromParams()
    this.requestingData()
  }

/**
 * * Retrieves the value of the id parameter from the route
 */
  public gettingIdFromParams():void {
    this.route.params.subscribe(params => {
      this.endpoint = params['id'];
    });
    if (this.endpoint === 'TOP') this.title = 'Kansas'
    else this.title = 'District of Columbia'
  }

  /**
   * * Request to get weather data, initializes today's data, and sets up chart data.
   */
  public requestingData(): void {

    this.subscription = this.weatherService.getWeatherData(this.endpoint).subscribe(data => {
      this.completeForecast = data as WeatherData;
      this.initializeTodaysData();
      this.setupChartData();
    });
  }

/**
 * * Initializes the todayForecast variable with the first element of the completeForecast.
 */
  public initializeTodaysData(): void {
    this.todayForecast = this.completeForecast.properties?.periods[0]
  }


  /**
   * * Organizes temperature data and then draws the chart
   */
  public setupChartData(): void {
    this.combinedTemperatures = this.organizeTemperatures();
    this.labels = this.combinedTemperatures.map(item => item.day);
    const dayTemperatures = this.combinedTemperatures.map(item => item.temperatures[0]);
    const nightTemperatures = this.combinedTemperatures.map(item => item.temperatures[1]);
    this.drawChart(
      dayTemperatures,
      nightTemperatures,
      )
  }

  /**
   * * Creates a line chart with day and night temperature data.
   */
  public drawChart(dayTemperature:number[], nightTemperature:number[]): void {
      this.lineChartData = {
        labels: this.labels,
        datasets: [
          {
            label: 'Night Temperature',
            data: nightTemperature,
            borderColor: '#2F689A',
            backgroundColor: '#2F689A',
            pointBackgroundColor: '#2F689A',
            pointStyle: 'rectRounded',
            fill: false,
            pointRadius: 5,
          },
          {
            label: 'Day Temperature',
            data: dayTemperature,
            borderColor: '#FEB237',
            backgroundColor: '#FEB237',
            pointBackgroundColor: '#FEB237',
            pointStyle: 'rectRounded',
            fill: false,
            pointRadius: 5,
          },


        ],
        plugins: {
          datalabels: {
            display: true
          }
        }
      } as ChartData
  }


    /**
     * * Organizes temperature data from a forecast into an array of objects.
     */
    public organizeTemperatures(): combinedTemperatures[] {
      const combinedTemperatures = [];
        for (let i = 0; i < this.completeForecast.properties.periods.length; i += 2) {
          const dayTemp = this.completeForecast.properties.periods[i];
          const nightTemp = this.completeForecast.properties.periods[i + 1];
          const relativeHumidity = this.completeForecast.properties.periods[i].relativeHumidity.value
      combinedTemperatures.push({
        day: dayTemp.name,
        temperatures: [dayTemp.temperature, nightTemp.temperature],
        relativeHumidity: relativeHumidity
      });
    }
    return combinedTemperatures
  }

    /**
     * * Navigates to the home page if the endpoint is defined.
     */
    public navigateToCards(): void {
      if (this.endpoint) {
        this.router.navigate(['']);
      }
    }

    ngOnDestroy() {
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
    }

}
