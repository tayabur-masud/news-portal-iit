import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { NewsComment } from '../models/comment.model';
import { environment } from "../../environments/environment";

@Injectable({ providedIn: 'root' })
export class CommentsService {
    private commentsUrl = `${environment.apiUrl}/comments`;

    constructor(private http: HttpClient) { }

    create(comment: Partial<NewsComment>): Observable<NewsComment> { return this.http.post<NewsComment>(this.commentsUrl, comment); }

    update(id: string, comment: Partial<NewsComment>): Observable<NewsComment> { return this.http.put<NewsComment>(`${this.commentsUrl}/${id}`, comment); }

    delete(id: string): Observable<any> { return this.http.delete(`${this.commentsUrl}/${id}`); }
}