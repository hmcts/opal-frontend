import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TestServiceService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/';

  public fetchTodo(id: number) {
    return this.http.get(`${this.baseUrl}/todos/${id}`);
  }
}
