import { Component, OnInit } from '@angular/core';
import { timeEnd } from 'console';

@Component({
  selector: 'app-ecg-graph',
  templateUrl: './ecg-graph.component.html',
  styleUrls: ['./ecg-graph.component.scss']
})
export class EcgGraphComponent implements OnInit {
  
  //variaveis 
  private time: number[] = [];
  private ecgSignal: number[] = [];
  private heartRateInterval: any;
  private sampleRate =1000;
  private bpm: number = 70;
  private duration: number = 10;
  private maxLength: number = 1000;
  private plotlyInstance: any;

  ngOnInit(): void {
    if(typeof window !== 'undefined'){
      this.createECGChart();
    }
  }

  //cria o grafico animado de batimentos cardiacos
  createECGChart(){
    import('plotly.js-dist').then(Plotly => {
      this.plotlyInstance = Plotly;

      this.heartRateInterval = setInterval(()=> {
        this.updateECGData();
        this.updateGraph();
      },1000 / this.sampleRate)
    }).catch(error => {
      console.log('error loading Plotly ECG')
    })
  }

  updateECGData(){
    const timePoint = this.time.length > 0 ? this.time[this.time.length -1] + 1 /this.sampleRate : 0;
    console.log('timepoint:', timePoint)
    this.time.push(timePoint)


    //simulando um sinal ecg 
    const heartBeat = Math.sin(2 * Math.PI * 1 * timePoint) + Math.random() * 0.05;
    console.log('heartBeat:', heartBeat)
    this.ecgSignal.push(heartBeat)

    //mantendo o comprimento do sinal ECG no limite da largura da tela
    if(this.time.length > this.maxLength){
      this.time.shift();
      this.ecgSignal.shift()
    }
  }

//atualiando o graficoECG de tempos em tempos
  updateGraph(){
    const trace = {
      x: this.time,
      y: this.ecgSignal,
      type: 'scatter',
      mode: 'lines',
      name: 'Heart Rate Signal',
      line: {
        color: 'rgb(255, 0, 0)',
        width: 2,
        shape: 'spline',
        smoothing:2.0
      }
    }

    const layout = {
      title: 'Real-Time ECG Signal',

      xaxis: {
        title: 'Time (s)',
        showgrid: true,
        zeroline: false
      },

      yaxis: {
        title: 'Amplitude (mV)',
        showgrid: true,
        zeroline: true
      },

      showlegend: false,
      plot_bgcolor: 'white',
      // updatemenus: [

      // ]
    }

    const data = [trace];

    if(this.time.length <= this.maxLength){
      if(this.plotlyInstance){
        this.plotlyInstance.newPlot('ecg-plot', data, layout);
      }
    } else{
      this.plotlyInstance.update('ecg-plot', {
        x: [this.time],
        y: [this.ecgSignal]
      });
    }
  }

}
