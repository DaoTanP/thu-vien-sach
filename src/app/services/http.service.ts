import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class HttpService
{
  private BOOK_API_URL = 'https://express-api.dao-tan-phattan.repl.co/books';
  // private USER_API_URL = 'https://express-api.dao-tan-phattan.repl.co/authentication';
  private USER_API_URL = 'https://localhost:44389/api/user';

  constructor(private httpClient: HttpClient) { }

  public login (user: User): Observable<any>
  {
    return this.httpClient.post(this.USER_API_URL + '/login', user, /* { observe: 'response', responseType: "text" } */);
  }

  public usernameExists (username: string): Observable<any>
  {
    return this.httpClient.post(this.USER_API_URL + "/usernameExists", { username });
  }

  public register (user: User): Observable<any>
  {
    return this.httpClient.post(this.USER_API_URL, user);
  }

  public editUser (user: any): Observable<any>
  {
    return this.httpClient.put(this.USER_API_URL, user);
  }

  public deleteUser (user: User): Observable<any>
  {
    return this.httpClient.post(this.USER_API_URL + '/delete', user, { observe: 'response', responseType: "text" });
  }

  public uploadAvatar ({ username, imageBytes }: any): Observable<any>
  {
    return this.httpClient.post(this.USER_API_URL + '/uploadAvatar', { username, imageBytes });
  }

  public changeUserPassword ({ username, oldPassword, newPassword }: any): Observable<any>
  {
    return this.httpClient.post(this.USER_API_URL + '/changePassword', { username, oldPassword, newPassword }, { observe: 'response', responseType: "text" });
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
