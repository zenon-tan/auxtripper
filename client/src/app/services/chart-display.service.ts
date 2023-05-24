import { Injectable } from '@angular/core';
import { Chart, ChartData } from 'chart.js/auto';
import { SpotifyVibe } from '../models/spotify-models';

@Injectable({
  providedIn: 'root'
})
export class ChartDisplayService {

  constructor() { }

  createChart(dataDefault: any) {

    return new Chart("MyChart", {
      type: 'radar',
      data: {
        labels: ['Energy', 'Danceability', 'Acousticness', 'Liveness', 'Valence'],
        datasets: [
          {
            label: "Value",
            data: [dataDefault.energy, dataDefault.danceability, dataDefault.loudness, dataDefault.liveness, dataDefault.valence],
            backgroundColor: 'rgb(29, 185, 84, 0.2)',
            borderColor: 'rgb(29, 185, 84, 0.2)',
            pointBackgroundColor: 'rgb(29, 185, 84)',
            pointBorderColor: 'rgb(29, 185, 84)',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(255, 99, 132)'
          }
        ],

      },
      options: {
        layout: {
          padding: 0
        },
        responsive: true,
        elements: {
          line: {
            borderWidth: 1,
            backgroundColor: 'white'
          }
        },
        aspectRatio: 1.1,
        maintainAspectRatio: false,

        scales: {
          r: {
            ticks: {
              display: false
            },
            pointLabels: {
              font: {
                size: 12,
              },
              color: 'white'
            },
            grid: {
              display: false,
              lineWidth: 0.2,
              color: 'grey',
              circular: true
            },
            angleLines: {
              lineWidth: 0.5,
              color: 'grey'
            },
            suggestedMin: 0.0,
            suggestedMax: 1.0
          },
        },
        plugins: {
          legend: {
            display: false,
            labels: {
              usePointStyle: true
            }
          }
        },
      }
    })
  }

  destoryChart(myChart: Chart) {
    myChart.clear()
    myChart.destroy()

  }
}
