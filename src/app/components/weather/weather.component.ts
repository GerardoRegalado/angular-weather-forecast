import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WeatherAPIService } from '../../services/weather-api.service';
import { Chart, ChartConfiguration, ChartData, ChartType } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'awf-weather',
  templateUrl: './weather.component.html',
  styleUrl: './weather.component.scss'
})
export class WeatherComponent implements OnInit {
  public endpoint: string = '';
  public title: string = ''
  public completeForecast: any

  public today: any
  public combinedTemperatures: { day: any; temperatures: any[]; relativeHumidity: any[] }[] = [];
  public labels: any[] = [];
  public periods: any;

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
        formatter: (value) => { return value  },
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

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.endpoint = params['id'];
    });
    if (this.endpoint === 'TOP') this.title = 'Kansas'
    else this.title = 'District of Columbia'
    Chart.register(ChartDataLabels)

    this.requestingData()
  }

  public async requestingData() {
   this.weatherService.getWeatherData(this.endpoint).subscribe(data => {
    this.completeForecast= data
    this.initializeData()
    this.setupChartData()
  })

  }

  public initializeData() {
    this.today = this.completeForecast.properties?.periods[0]

  }

  public navigateToCards() {
      if (this.endpoint) {
        this.router.navigate(['']);
      }
    }


    public drawChart(dayTemperature:any[], nightTemperature:any[], relativeHumidity: any[]) {
      this.lineChartData = {
        labels: this.labels,
        datasets: [
          {
            label: 'Humidity (%)',
            data: relativeHumidity,
            borderColor: '#FF6484',
            backgroundColor: '#FF6484',
            pointBackgroundColor: '#FF6484',
            pointStyle: 'rectRounded',
            fill: false,
            stepped: true,
            pointRadius: 5,
          },
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
      console.log(this.combinedTemperatures)
      console.log(this.completeForecast)
      this.labels = this.combinedTemperatures.map(item => item.day);
      const dayTemperatures = this.combinedTemperatures.map(item => item.temperatures[0]);
      const nightTemperatures = this.combinedTemperatures.map(item => item.temperatures[1]);
      const relativeHumidity = this.combinedTemperatures.map(item => item.relativeHumidity)
      console.log(relativeHumidity)
      this.drawChart(dayTemperatures, nightTemperatures, relativeHumidity)

    }

    public organizeTemperatures() {
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
}

