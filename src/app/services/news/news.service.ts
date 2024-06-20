import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  private apiUrl = 'https://api.spaceflightnewsapi.net/v4/articles/?limit=50';

  constructor(private http: HttpClient) {}

  getArticles(limit: number = 20): Observable<any> {
    let params = new HttpParams().set('limit', limit.toString());

    return this.http.get<any>(this.apiUrl, { params: params });
  }

  getArticleById(id: number): Observable<any> {
    const url = `https://api.spaceflightnewsapi.net/v4/articles/${id}`;
    return this.http.get<any>(url);
  }
}
