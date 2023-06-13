import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, map, of } from 'rxjs';
import { Book } from 'src/app/models/book';
import { SearchModel } from 'src/app/models/search-model';
import { AlertService, AlertType } from 'src/app/services/alert.service';
import { AuthGuardService } from 'src/app/services/auth-guard.service';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css']
})
export class BookDetailsComponent
{
  private userId: string | undefined = undefined;
  protected book: Book = new Book();
  protected isFavorite: boolean = false;
  protected waitingForFavoriteAction = false;

  protected inCategory: Observable<Book[]> = of([]);
  protected fromAuthor: Observable<Book[]> = of([]);
  protected fromPublisher: Observable<Book[]> = of([]);

  constructor(private httpService: HttpService, private authGuardService: AuthGuardService, private route: ActivatedRoute, private router: Router, private alertService: AlertService)
  {
    this.waitingForFavoriteAction = true;
    this.route.paramMap.subscribe(params =>
    {
      const id = params.get('id') || '';
      const categorySearch = new SearchModel();
      const authorSearch = new SearchModel();
      const publisherSearch = new SearchModel();
      this.inCategory;
      this.fromAuthor;
      this.fromPublisher;

      this.httpService.getBooks(id).subscribe(book =>
      {
        this.book = new Book(book.id, book.title, book.category.name, book.image, book.author.name, book.publisher.name, book.publishDate || 'Không rõ', book.overview, book.numberOfPages);

        if (authGuardService.isLoggedIn)
          authGuardService.userData.subscribe({
            next: res =>
            {
              httpService.isFavorite({ bookId: this.book.id, userId: res.id }).subscribe(fav => this.isFavorite = fav);
              this.userId = res.id;
            }
          });

        this.waitingForFavoriteAction = false;

        categorySearch.category = [this.book.category];
        authorSearch.author = this.book.author;
        publisherSearch.publisher = this.book.publisher;

        this.inCategory = this.httpService.searchBooks(categorySearch).pipe(map((books: Book[]) => books.map((book: any) => new Book(book.id, book.title, book.category.name, book.image, book.author.name, book.publisher.name, book.publishDate, book.overview, book.numberOfPages))));
        this.fromAuthor = this.httpService.searchBooks(authorSearch).pipe(map((books: Book[]) => books.map((book: any) => new Book(book.id, book.title, book.category.name, book.image, book.author.name, book.publisher.name, book.publishDate, book.overview, book.numberOfPages))));
        this.fromPublisher = this.httpService.searchBooks(publisherSearch).pipe(map((books: Book[]) => books.map((book: any) => new Book(book.id, book.title, book.category.name, book.image, book.author.name, book.publisher.name, book.publishDate, book.overview, book.numberOfPages))));
      });
    });
  }

  addFavorite ()
  {
    this.waitingForFavoriteAction = true;
    if (!this.userId)
    {
      this.router.navigate(['/login']);
      return;
    }

    this.httpService.addFavorite({ bookId: this.book.id, userId: this.userId }).subscribe({
      next: res =>
      {
        this.waitingForFavoriteAction = false;
        this.isFavorite = true;
      }, error: err =>
      {
        this.waitingForFavoriteAction = false;
        this.alertService.appendAlert('Đã xảy ra lỗi, vui lòng thử lại sau', AlertType.danger, 5, 'alert-container');
      }
    });
  }

  removeFavorite ()
  {
    this.waitingForFavoriteAction = true;
    if (!this.userId)
    {
      this.router.navigate(['/login']);
      return;
    }

    this.httpService.removeFavorite({ bookId: this.book.id, userId: this.userId }).subscribe({
      next: res =>
      {
        this.waitingForFavoriteAction = false;
        this.isFavorite = false;
      }, error: err =>
      {
        this.waitingForFavoriteAction = false;
        this.alertService.appendAlert('Đã xảy ra lỗi, vui lòng thử lại sau', AlertType.danger, 5, 'alert-container');
      }
    });
  }
}
