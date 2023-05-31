import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService
{
  private BOOK_API_URL = 'https://express-api.dao-tan-phattan.repl.co/books';
  // private USER_API_URL = 'https://express-api.dao-tan-phattan.repl.co/authentication';
  private USER_API_URL = 'https://localhost:44389/api/user';

  constructor(private httpClient: HttpClient) { }

  public authenticate (username: string, password: string): Observable<any>
  {
    return this.httpClient.post(this.USER_API_URL + '/login', { username, password }, { observe: 'response', responseType: "text" });
  }

  public usernameExists (username: string): Observable<any>
  {
    return this.httpClient.post(this.USER_API_URL + "/usernameExists", { username });
  }

  public register (displayName: string, username: string, password: string): Observable<any>
  {
    return this.httpClient.post(this.USER_API_URL, { displayName, username, password });
  }

  public getBooks (id: string = ''): Observable<any>
  {
    if (id != '')
      return this.httpClient.get(this.BOOK_API_URL + '/' + id);

    return this.httpClient.get(this.BOOK_API_URL);
  }

  public searchBooks (keyword: string): Observable<any>
  {
    return this.httpClient.get(this.BOOK_API_URL + '/search?q=' + keyword);
  }
}
