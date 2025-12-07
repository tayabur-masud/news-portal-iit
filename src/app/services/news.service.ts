import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NewsService {
  private newsUrl = 'http://localhost:3000/news';

  constructor(private http: HttpClient) { }

  getAll(): Observable<any[]> { return this.http.get<any[]>(this.newsUrl); }

  getAllWithPagination(page: number, search: string = ''): Observable<any> {
    let params: any = { _page: page, _limit: 2 };
    if (search) {
      params['q'] = search;
    }
    return this.http.get<any[]>(this.newsUrl, {
      params,
      observe: 'response'
    });
  }

  getById(id: number): Observable<any> { return this.http.get<any>(`${this.newsUrl}/${id}`); }

  create(news: any): Observable<any> { return this.http.post(this.newsUrl, news); }

  update(id: number, news: any): Observable<any> { return this.http.patch(`${this.newsUrl}/${id}`, news); }

  delete(id: number): Observable<any> { return this.http.delete(`${this.newsUrl}/${id}`); }
}
