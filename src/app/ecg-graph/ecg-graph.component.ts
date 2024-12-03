import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ecg-graph',
  templateUrl: './ecg-graph.component.html',
  styleUrls: ['./ecg-graph.component.scss']
})
export class EcgGraphComponent implements OnInit {

  private time: number[] = [];
  private ecgSignal: number[] = [];
  private heartRateInterval: any;
  private sampleRate = 40;
  private bpm: number = 60;
  private duration: number = 10;
  private maxLength: number = 2500;
  private plotlyInstance: any;
  private currentTime: number = 0;
  private timeElapsed: number = 0;

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.createECGChart();
    }
  }

  createECGChart() {
    import('plotly.js-dist').then(Plotly => {
      this.plotlyInstance = Plotly;

      // Inicializando o gráfico
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
          smoothing: 2.0
        }
      };

      const layout = {
        title: 'Sinal ECG em Tempo Real',
        xaxis: {
          title: 'Tempo Transcorrido',
          showgrid: true,
          zeroline: true,
          ticks: 'outside',
          tickmode: 'array',
          tickvals: this.getXaxisLayout().tickvals,
          ticktext: this.getXaxisLayout().ticktext
        },
        yaxis: {
          title: 'Número de Batimentos (BPM)',
          range: [0, 200],
          showgrid: true,
          zeroline: true,
          ticks: 'outside'
        },
        showlegend: false,
        plot_bgcolor: 'white',
      };

      this.plotlyInstance.newPlot('ecg-plot', [trace], layout);  // Plotando o gráfico inicialmente

      // Atualizando o gráfico a cada 100ms
      this.heartRateInterval = setInterval(() => {
        this.updateECGData();
        this.updateGraph();
        this.currentTime += 0.1;  // Atualiza o tempo em incrementos de 100ms
        this.timeElapsed += 0.1;

        if (this.timeElapsed >= this.duration) {
          this.resetBPM();
          this.timeElapsed = 0;
          this.resetGraphData();
        }

      }, 100); // Atualiza o gráfico 10 vezes por segundo
    }).catch((error) => {
      console.log('Erro ao carregar Plotly ECG', error);
    });
  }

  resetBPM() {
    this.bpm = Math.floor(Math.random() * (100 - 60 + 1)) + 60;
    console.log('BPM resetado para:', this.bpm);
  }


  //limpa os dados do grafico, incluindo tanto o tempo quanto o sinal ECG
  resetGraphData(){
    this.time = [];
    this.ecgSignal = [];
  }

  updateECGData() {
    const timePoint = this.currentTime;
    console.log('timePoint:', timePoint);

    const heartBeat = this.generateHeathBeat(timePoint) *60;
    console.log('heartBeat', heartBeat);

    this.time.push(timePoint);
    this.ecgSignal.push(heartBeat);

    if (this.time.length > this.maxLength) {
      this.time.shift();
      this.ecgSignal.shift();
    }
  }

  generateHeathBeat(time: number): number {
    const heartBeatCycleDuration = 60 / this.bpm;  // Ciclo de batimento com base no BPM
    const relativeTime = time % heartBeatCycleDuration;

    if (relativeTime < 7) {
      return 1.0 + Math.random() * 0.1;
    }

    if (relativeTime >= 7 && relativeTime < 9) {
      return 3.0 * Math.random() * 0.5;
    }

    return 1.0 + Math.random() * 0.1;
  }

  updateGraph() {
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
        smoothing: 2.0
      }
    };

    const layout = {
      title: 'Sinal ECG em Tempo Real',
      xaxis: {
        title: 'Tempo Transcorrido',
        showgrid: true,
        zeroline: true,
        ticks: 'outside',
        tickmode: 'array',
        tickvals: this.getXaxisLayout().tickvals,
        ticktext: this.getXaxisLayout().ticktext
      },
      yaxis: {
        title: 'Número de Batimentos (BPM)',
        range: [50, 100],
        showgrid: true,
        zeroline: true,
        ticks: 'outside'
      },
      showlegend: false,
      plot_bgcolor: 'white',
    };

    const updateData = {
      x: [this.time],
      y: [this.ecgSignal]
    }

    this.plotlyInstance.animate('ecg-plot', {
      data: [trace],
      layout: layout,
      transition: {
        duration: 500,
        easing: 'cubic-in-out'
      }
    })

    if (this.time.length <= this.maxLength) {
      this.plotlyInstance.newPlot('ecg-plot', [trace], layout);
    } else {
      this.plotlyInstance.update('ecg-plot', {
        x: [this.time],
        y: [this.ecgSignal]
      });
    }
  }

  getXaxisLayout() {
    const tickvals: number[] = [];
    const ticktext: string[] = [];
    let timeInSeconds = Math.floor(this.currentTime);

    console.log('time:', timeInSeconds);

    // Convertendo 60 segundos em milissegundos
    if (timeInSeconds < 60) {
      for (let i = 0; i <= timeInSeconds; i++) {
        tickvals.push(i);
        ticktext.push(`${i}s`);
      }
    } else if (timeInSeconds >= 60 && timeInSeconds < 3600) {
      for (let i = 0; i < Math.floor(timeInSeconds / 60); i++) {
        tickvals.push(i * 60);
        ticktext.push(`${i + 1}m`);
      }
    } else {
      for (let i = 0; i < Math.floor(timeInSeconds / 3600); i++) {
        tickvals.push(i * 3600);
        ticktext.push(`${i + 1}h`);
      }
    }

    return { tickvals, ticktext };
  }
}
