import { Component, Input } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType, plugins } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import Chart from 'chart.js/auto';
import { Router } from '@angular/router';



@Component({
  selector: 'awf-weather-card',
  templateUrl: './weather-card.component.html',
  styleUrl: './weather-card.component.scss'
})
export class WeatherCardComponent {

  @Input() weatherData: any;
  @Input() cityName: string = '';
  @Input() endpoint: string = ''

  public dailyTpm = 0
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

  public combinedTemperatures: { day: any; temperatures: any[]; }[] = []

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
    this.initializeValues()
    this.setupChartData()
  }

  public initializeValues() {
    this.todayTmp = this.weatherData.properties?.periods[0].temperature
    this.tmpUnits = this.weatherData.properties?.periods[0].temperatureUnit
    this.detailedForecast = this.weatherData.properties?.periods[0].detailedForecast
    this.shortForecast = this.weatherData.properties?.periods[0].shortForecast
    this.windSpeed = this.weatherData.properties?.periods[0].windSpeed
    this.windDirection = this.weatherData.properties?.periods[0].windDirection
    this.image = this.weatherData.properties?.periods[0].icon
    this.isDayTime = this.weatherData.properties?.periods[0].isDaytime
    this.relativeHumidity = this.weatherData.properties?.periods[0].relativeHumidity
    this.name = this.weatherData.properties?.periods[0].name
  }

  public drawChart(dayTemperature:any[], nightTemperature:any[]) {
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

  public setupChartData() {
    this.combinedTemperatures =this.organizeTemperatures();
    this.labels = this.combinedTemperatures.slice(0, 5).map(item => item.day);
    const dayTemperatures = this.combinedTemperatures.slice(0, 5).map(item => item.temperatures[0]);
    const nightTemperatures = this.combinedTemperatures.slice(0, 5).map(item => item.temperatures[1]);
    this.drawChart(dayTemperatures, nightTemperatures)

  }

  public organizeTemperatures() {
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

  public navigateToWeather(): void {
    if (this.endpoint) {
      this.router.navigate(['/weather', this.endpoint]);
    }
  }
}
