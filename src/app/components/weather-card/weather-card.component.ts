import { Component, Input, OnInit } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import Chart from 'chart.js/auto';
import { Router } from '@angular/router';
import { Forecast } from '../../classes/forecast';
import { WeatherData, combinedTemperatures } from '../../classes/weather-data';

@Component({
  selector: 'awf-weather-card',
  templateUrl: './weather-card.component.html',
  styleUrl: './weather-card.component.scss'
})
export class WeatherCardComponent implements OnInit {
  @Input() weatherData: WeatherData = new WeatherData(); //* Used to receive the weather data info
  @Input() cityName: string = ''; //* Used to receive city name
  @Input() endpoint: string = '' //* Used to receive endpoint

  public todayForecast: Forecast = new Forecast() //* Used to save the daily forecast
  public combinedTemperatures: combinedTemperatures[]= [] //* Used to combine the day and night temperature

  public labels: string[] = []; // * Labels for the chart
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
          size: 8
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

  constructor(private router: Router){}

  ngOnInit(): void {
    Chart.register(ChartDataLabels)
    this.initializeTodayValues()
    this.setupChartData()
  }

  /**
   * * Initializes the value of today's forecast by assigning it the first element in the
   * * weatherData's periods array.
   */
  public initializeTodayValues(): void {
    this.todayForecast = this.weatherData.properties.periods[0]
  }

/**
 * * Organizes temperature data, extracts the labels and temperatures for the first 5 days
 */
  public setupChartData(): void {
    this.combinedTemperatures =this.organizeTemperatures();
    this.labels = this.combinedTemperatures.slice(0, 5).map(item => item.day);
    const dayTemperatures = this.combinedTemperatures.slice(0, 5).map(item => item.temperatures[0]);
    const nightTemperatures = this.combinedTemperatures.slice(0, 5).map(item => item.temperatures[1]);
    this.drawChart(dayTemperatures, nightTemperatures)
  }

  /**
   * * Creates a line chart with day and night temperature data.
   */
  public drawChart(dayTemperature:any[], nightTemperature:any[]): void {
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
 * * Organizes the day and night temperatures from a weather data object into an array of
 * * combined temperatures.
 */
  public organizeTemperatures(): combinedTemperatures[] {
    const combinedTemperatures = [];
      for (let i = 0; i < this.weatherData.properties.periods.length; i += 2) {
        const dayTemp = this.weatherData.properties.periods[i];
        const nightTemp = this.weatherData.properties.periods[i + 1];
        combinedTemperatures.push({
          day: dayTemp.name,
          temperatures: [dayTemp.temperature, nightTemp.temperature]
        });
      }
    return combinedTemperatures
  }

/**
 * * Navigates to the weather page with a specified endpoint if it exists.
 */
  public navigateToWeather(): void {
    if (this.endpoint) {
      this.router.navigate(['/weather', this.endpoint]);
    }
  }
}
