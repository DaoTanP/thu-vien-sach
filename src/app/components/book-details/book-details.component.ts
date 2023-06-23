import { Component } from '@angular/core';
import { FormControl, Validators, FormGroup, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, map, of } from 'rxjs';
import { convertJSToCSDate, convertToJSDate } from 'src/app/models/Utils';
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
  protected userId: string | undefined = undefined;
  protected cardNumber: string | undefined = undefined;
  protected book: Book = new Book();
  protected isFavorite: boolean = false;
  protected waitingForFavoriteAction = false;
  protected waitingForBorrowAction = false;

  protected inCategory: Observable<Book[]> = of([]);
  protected fromAuthor: Observable<Book[]> = of([]);
  protected fromPublisher: Observable<Book[]> = of([]);

  protected borrowDate: FormControl = new FormControl(convertToJSDate(new Date().toLocaleDateString()), [Validators.required]);
  protected returnDate: FormControl = new FormControl(null, [Validators.required]);

  protected borrowForm: FormGroup = new FormGroup({
    borrowDate: this.borrowDate,
    returnDate: this.returnDate,
  });

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
              this.cardNumber = res.cardNumber;
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
    if (!this.userId)
    {
      this.router.navigate(['/login']);
      return;
    }

    this.waitingForFavoriteAction = true;
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
    if (!this.userId)
    {
      this.router.navigate(['/login']);
      return;
    }

    this.waitingForFavoriteAction = true;
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

  borrowEvent ()
  {
    if (!this.userId)
    {
      this.router.navigate(['/login']);
      return;
    }
    if (!this.cardNumber)
    {
      this.alertService.appendAlert('Vui lòng liên kết thẻ thư viện trước khi mượn sách', AlertType.danger, 10, 'alert-container');
      return;
    }
  }

  borrow ()
  {
    this.waitingForBorrowAction = true;
    const formData = this.borrowForm.value;
    const data = {
      cardNumber: this.cardNumber,
      bookId: this.book.id,
      borrowDate: convertJSToCSDate(formData.borrowDate),
      returnDate: convertJSToCSDate(formData.returnDate)
    }
    this.httpService.borrow(data).subscribe({
      next: res =>
      {
        this.waitingForBorrowAction = false;
        this.alertService.appendAlert('Đăng ký mượn thành công, mang thẻ đến thư viện để nhận sách', AlertType.success, 10, 'alert-container');
      }, error: err =>
      {
        this.waitingForBorrowAction = false;
        this.alertService.appendAlert('Đã xảy ra lỗi, vui lòng thử lại sau', AlertType.danger, 5, 'alert-container');
      }
    });
  }
}
