import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Hello World App';
  message = '';
  loading = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getMessage();
  }

  getMessage() {
    this.loading = true;
    this.http.get<{message: string, timestamp: string}>(`${environment.apiUrl}/hello`)
      .subscribe({
        next: (response) => {
          this.message = `${response.message} (${response.timestamp})`;
          this.loading = false;
        },
        error: (error) => {
          this.message = 'Failed to connect to backend';
          this.loading = false;
          console.error('Error:', error);
        }
      });
  }
}