import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../core/tokens/api.token';
import { List, ListRequest } from '../interfaces/list.interface';
import { shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ListsService {
  constructor(private readonly http: HttpClient, @Inject(API_URL) private readonly apiUrl: string) {}

  addNew(list: ListRequest) {
    return this.http.post<{ id: string }>(`${this.apiUrl}/lists`, list);
  }

  delete(id: string) {
    return this.http.delete(`${this.apiUrl}/lists/${id}`);
  }

  update(id: string, list: Partial<List>) {
    const { id: someId, createdAt, ...otherList } = list;
    return this.http.put<{ id: string }>(`${this.apiUrl}/lists/${id}`, otherList);
  }

  getAll() {
    return this.http.get<List[]>(`${this.apiUrl}/lists`).pipe(shareReplay(1));
  }
}
