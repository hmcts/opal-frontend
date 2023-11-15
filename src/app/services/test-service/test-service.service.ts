import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TestServiceService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/';

  public fetchTodo(id: number) {
    const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
    return this.http.get(`${this.baseUrl}`, { headers, responseType: 'text' });
  }
}
