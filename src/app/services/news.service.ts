import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { News } from '../models/news.model';
import { PaginatedResponse } from '../models/paginated-response.model';

@Injectable({ providedIn: 'root' })
export class NewsService {
  private newsUrl = `${environment.apiUrl}/news`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<News[]> { return this.http.get<News[]>(this.newsUrl); }

  getAllWithPagination(pageNumber: number, pageSize: number, searchTerm: string = ''): Observable<PaginatedResponse<News>> {
    const params: any = { pageNumber, pageSize };
    if (searchTerm) {
      params['searchTerm'] = searchTerm;
    }
    return this.http.get<PaginatedResponse<News>>(this.newsUrl, { params });
  }

  getById(id: string): Observable<News> { return this.http.get<News>(`${this.newsUrl}/${id}`); }

  create(news: Partial<News>): Observable<News> { return this.http.post<News>(this.newsUrl, news); }

  update(id: string, news: Partial<News>): Observable<News> { return this.http.put<News>(`${this.newsUrl}/${id}`, news); }

  delete(id: string): Observable<any> { return this.http.delete(`${this.newsUrl}/${id}`); }
}
