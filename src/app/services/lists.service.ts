import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { API_URL } from '../core/tokens/api.token';
import { List, ListPublic, ListRequestBase } from '../interfaces/list.interface';
import { shareReplay } from 'rxjs';
import { IS_PUBLIC_API } from '../core/tokens/public-api.token';

@Injectable({
  providedIn: 'root',
})
export class ListsService {
  constructor(private readonly http: HttpClient, @Inject(API_URL) private readonly apiUrl: string) {}

  getListBySlugPublic(slug: string) {
    return this.http
      .get<ListPublic>(`${this.apiUrl}/lists/public/${slug}`, {
        context: new HttpContext().set(IS_PUBLIC_API, true),
      })
      .pipe();
  }

  getList(id: string) {
    return this.http.get<ListPublic>(`${this.apiUrl}/lists/${id}`).pipe();
  }

  addNew(list: ListRequestBase) {
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
