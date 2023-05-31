import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Book } from 'src/app/models/book';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-book-search',
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.css']
})
export class BookSearchComponent
{
  protected displayStyleHorizontal: boolean = false;
  protected searchString: string | undefined = undefined;
  protected pageNumber: number | undefined = undefined;

  bookListAsync: Observable<Book[]> = of([]);
  protected bookList: Book[] = [];
  protected firstItemOnPage: number = 0;
  protected lastItemOnPage: number = 0;
  protected totalItems: number = 0;
  protected itemsPerPage: number = 0;

  protected searchInput: FormControl = new FormControl(null);
  protected publishedFrom: FormControl = new FormControl(null);
  protected publishedTo: FormControl = new FormControl(null);
  protected searchForm: FormGroup = new FormGroup({
    searchInput: this.searchInput,
    publishedFrom: this.publishedFrom,
    publishedTo: this.publishedTo,
  });

  constructor(private httpService: HttpService, private router: Router, private route: ActivatedRoute)
  {
    this.route.queryParams.subscribe(params =>
    {
      this.searchString = params['q'];
      if (this.searchString === undefined)
      {
        this.bookListAsync = this.httpService.getBooks();
      } else
      {
        this.searchInput.setValue(this.searchString);
        this.bookListAsync = this.httpService.searchBooks(this.searchString);
      }

      this.pageNumber = params['p'];
      this.router.navigate(['/search'], { queryParams: { p: this.pageNumber }, queryParamsHandling: 'merge' })

      this.getList();
      this.updatePaginationInfo();
    });
  }

  reset ()
  {
    this.router.navigate(['/search']);
  }

  getList ()
  {
    this.bookListAsync.subscribe(books =>
    {
      this.bookList = books;
      this.totalItems = books.length;
    });
  }

  search ()
  {
    let query = this.searchForm.value.searchInput;
    if (!query || query == '')
      return;

    this.router.navigate(['/search'], { queryParams: { q: this.searchForm.value.searchInput } });
  }

  onChangePage (e: any)
  {
    this.router.navigate(['/search'], { queryParams: { p: e.currentPage }, queryParamsHandling: 'merge' })
  }

  getPaginationInfo (e: any)
  {
    this.firstItemOnPage = (e.currentPage - 1) * e.itemsPerPage + 1;
    this.itemsPerPage = e.itemsPerPage;
    this.lastItemOnPage = e.currentPage * this.itemsPerPage;
    this.totalItems = e.totalItems;
    if (this.lastItemOnPage > this.totalItems)
      this.lastItemOnPage = this.totalItems;
  }

  updatePaginationInfo ()
  {
    this.firstItemOnPage = 1
    this.lastItemOnPage = this.firstItemOnPage + this.itemsPerPage - 1;
    if (this.lastItemOnPage > this.totalItems)
      this.lastItemOnPage = this.totalItems
  }
}
