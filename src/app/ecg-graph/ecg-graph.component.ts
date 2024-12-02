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
  private sampleRate =40;
  private bpm: number = 60;
  private duration: number = 10;
  private maxLength: number = 2500;
  private plotlyInstance: any;
  private currentTime: number = 0;
  private timeElapsed: number =0;

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
        this.currentTime +=1;
        this.timeElapsed +=1;

        if(this.timeElapsed >= 10){
          this.resetBPM();
          this.timeElapsed = 0
        }
      },9000 / this.sampleRate)
    }).catch((error)=> {
      console.log('error loading Plotly ECG', error)
    })
  }

  resetBPM(){
    this.bpm = Math.floor(Math.random() * (80 - 60 + 1)) + 30;
    console.log('BPM reset to:' , this.bpm)
  }

  updateECGData(){
    // const timePoint = this.time.length > 0 ? this.time[this.time.length -1] + 1 /this.sampleRate : 0;
    const timePoint = this.currentTime;
    console.log('timePoint:', timePoint)
    const heartBeat = this.generateHeathBeat(timePoint);
    console.log('heartBeat', heartBeat)
    this.time.push(timePoint)
    this.ecgSignal.push(heartBeat)

    //mantendo o comprimento do sinal ECG no limite da largura da tela
    if(this.time.length > this.maxLength){
      this.time.shift();
      this.ecgSignal.shift();
    }
  }

  //method to generate the heath beat from time to time
  generateHeathBeat(time: number): number{
    // const heartBeatCycleDuration = 100 / this.bpm;
    const heartBeatCycleDuration = 10;
    const relativeTime = time % heartBeatCycleDuration;

    if(relativeTime < 7){
      return 1.0 + Math.random() * 0.1;
    }

    if(relativeTime >= 7 && relativeTime < 9){
      return 3.0 * Math.random() * 0.5;
    }

    return 1.0 + Math.random() * 0.1;
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
        color: 'green',
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
        zeroline: true
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
