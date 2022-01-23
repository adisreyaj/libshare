import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../core/tokens/api.token';
import { Library, LibraryRequest } from '../interfaces/library.interface';
import { shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LibrariesService {
  constructor(private readonly http: HttpClient, @Inject(API_URL) private readonly apiUrl: string) {}

  addNew(library: LibraryRequest) {
    return this.http.post<{ id: string }>(`${this.apiUrl}/libraries`, library);
  }

  delete(id: string) {
    return this.http.delete(`${this.apiUrl}/libraries/${id}`);
  }

  update(id: string, library: Partial<Library>) {
    const { id: someId, createdAt, ...otherLibrary } = library;
    return this.http.put<{ id: string }>(`${this.apiUrl}/libraries/${id}`, otherLibrary);
  }

  getAll() {
    return this.http.get<Library[]>(`${this.apiUrl}/libraries`).pipe(shareReplay(1));
  }

  getSuggestions(query: string) {
    return this.http
      .get<{ name: string }[]>(`${this.apiUrl}/libraries/suggestions/${encodeURIComponent(query)}`)
      .pipe();
  }

  getLibraryMetadata(name: string) {
    return this.http.get<Library>(`${this.apiUrl}/libraries/metadata/${encodeURIComponent(name)}`).pipe(shareReplay(1));
  }
}
