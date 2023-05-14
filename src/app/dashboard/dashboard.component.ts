import { Component , OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{
  private file!: File;
  private periodicity!: string;
  private periods!: number;
  csvData: string[][]=[];
  timer: number = 60;
  showTimer: boolean = false;

  
  constructor(private auth: AuthService, private http: HttpClient,private router: Router) {}

  ngOnInit(): void {
    this.auth.canAcces();
  }
  

  onFileSelected(event: any): void {
    this.file = event.target.files[0];
    
    console.log(this.file);
  }

  onSubmit(): void {
    this.showTimer = true;
    this.startTimer();

    const formData = new FormData();
    formData.append('csvFile', this.file);
    formData.append('periodicity', this.periodicity);
    formData.append('periods', this.periods.toString());
    console.log(formData)
    this.http.post('http://127.0.0.1:5000/', formData, { responseType: 'text' }).subscribe(
      (response) => {
        console.log(response)
        console.log('File uploaded successfully');
        let lines = response.split("\n");
        let r2 = lines.slice(0, 1).join("\n");
        console.log(r2);
        this.csvData = this.parseCSV(response)
        this.router.navigate(['/prediction'], { state: { chartData: this.csvData,R2:r2 } });
    
          },
      (error) => {
        console.error('File upload failed',error.message);
      }
    );
  }

  onPeriodicityChange(event: any): void {
    this.periodicity = event.target.value;
  }

  onPeriodsChange(event: any): void {
    this.periods = event.target.value;
  }
  private parseCSV(csv: string): string[][] {
    const rows: string[] = csv.split('\r\n');
    const data: string[][] = [];
    console.log(rows)
    rows.forEach(row => {
      data.push(row.split(','));
    });
    return data;
  }
  startTimer() {
    
    const intervalId = setInterval(() => {
      this.timer -= 1;
      if (this.timer <= 0) {
        
        clearInterval(intervalId);
        this.showTimer = false;
        this.timer = 60;
      }
    }, 1000);
  }
}