import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ChartConfiguration, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { WebsocketService } from '../../services/websocket.service';

@Component({
   selector: 'app-encuesta',
   templateUrl: './encuesta.component.html',
   styleUrl: './encuesta.component.css'
})
export class EncuestaComponent implements OnInit {

   @ViewChild(BaseChartDirective) chart: BaseChartDirective<'bar'> | undefined;

   public barChartOptions: ChartConfiguration<'bar'>['options'] = {
      // We use these empty structures as placeholders for dynamic theming.
      // scaleShowVerticalLines: false,
      responsive: true,
      scales: {
         x: {},
         y: {
            min: 10,
         },
      },
      plugins: {
         legend: {
            display: true,
         },
         //   datalabels: {
         //     anchor: 'end',
         //     align: 'end',
         //   },
      },
   };
   public barChartType = 'bar' as const;

   public barChartData: ChartData<'bar'> = {
      labels: ['Pregunta 1', 'Pregunta 2', 'Pregunta 3', 'Pregunta 4'],
      datasets: [
         {
            data: [65, 59, 80, 81],
            label: 'Entrevistados',
         },
      ],
   };

   constructor(
      private http: HttpClient,
      private wsService: WebsocketService,
   ) { }

   ngOnInit(): void {

      this.http.get('http://localhost:5000/grafica').subscribe((valores: any) => {
         console.log({ valores });

         this.barChartData.datasets[0].data = valores;
         this.chart?.update();
      });

      this.escucharSocket();
   }

   escucharSocket() {
      this.wsService.listen('cambio-grafica').subscribe((valores: any) => {

         this.barChartData.datasets[0].data = valores;
         this.chart?.update();

         console.log({ valores });

      });
   }

}
