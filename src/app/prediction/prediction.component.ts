import { Component,Host,OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-prediction',
  templateUrl: './prediction.component.html',
  styleUrls: ['./prediction.component.css']
})
export class PredictionComponent implements OnInit {
  public labelss: string[] = [];
  public datas: number[] = [];
  chartData: any = [];

  R2:any=[];

  constructor(private route: ActivatedRoute) { }
  
  

  chatdata = {
    labels: this.labelss,
    datasets: [{
      label: 'Sales Prediction',
      data: this.datas,
      fill: false,
      borderColor: 'rgb(0, 0, 0)',
      tension: 0.1,
     
    }]
  };

  ngOnInit(): void {
    this.chartData = history.state.chartData;
    console.log(this.chartData)
    this.chartData=this.chartData.slice(2)
    this.chartData.map((row: any) => {
 
  if (row.length > 1) {
    this.labelss.push(row[0] as string); 
    this.datas.push(Number(row[1]) as number);  
  }
  this.R2=history.state.R2;
});
    console.log('Chart Data:', this.chartData);
  
    
  }

}