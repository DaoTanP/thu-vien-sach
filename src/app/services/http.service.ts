import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService
{
  private BOOK_API_URL = 'http://localhost:3000/books';
  private USER_API_URL = 'http://localhost:3000/authentication';

  constructor(private httpClient: HttpClient) { }

  public authenticate (username: string, password: string): Observable<any>
  {
    return this.httpClient.post(this.USER_API_URL, { username, password }, { observe: 'response', responseType: "text" });
  }

  public getBooks (id: string = ''): Observable<any>
  {
    if (id != '')
      return this.httpClient.get(this.BOOK_API_URL + '/' + id);

    return this.httpClient.get(this.BOOK_API_URL);
  }
}
