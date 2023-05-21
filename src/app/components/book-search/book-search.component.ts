import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Book } from 'src/app/models/book';
import { BookService } from 'src/app/services/book.service';

@Component({
  selector: 'app-book-search',
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.css']
})
export class BookSearchComponent
{
  protected bookList: Book[] = [];
  bookListOriginal: Book[] = [];
  protected firstItemOnPage: number = 0;
  protected lastItemOnPage: number = 0;
  protected totalItems: number = 0;
  protected itemsPerPage: number = 0;

  protected searchInput: FormControl = new FormControl(null);
  protected publishedFrom: FormControl = new FormControl(null);
  protected publishedTo: FormControl = new FormControl(null);
  public searchForm: FormGroup = new FormGroup({
    searchInput: this.searchInput,
    publishedFrom: this.publishedFrom,
    publishedTo: this.publishedTo,
  });

  constructor(private bookService: BookService)
  {
    this.bookService.getAsync().subscribe(books =>
    {
      this.bookListOriginal = books;
      this.bookList = this.bookListOriginal.map((book: any) =>
      {
        return { imgUrl: book.image, publishDate: book.published, ...book }
      });
      this.updatePaginationInfo();
    });
  }

  reset ()
  {
    this.bookList = this.bookListOriginal;
    this.updatePaginationInfo();
  }

  search ()
  {
    let query = this.searchForm.value.searchInput;
    if (!query || query == '')
      return;

    this.bookList = this.bookService.search(this.bookListOriginal, query);
    this.updatePaginationInfo();
  }

  getPaginationInfo (e: any)
  {
    this.firstItemOnPage = (e.currentPage - 1) * e.itemsPerPage + 1;
    this.itemsPerPage = e.itemsPerPage;
    this.lastItemOnPage = e.currentPage * this.itemsPerPage;
    if (this.lastItemOnPage > e.totalItems)
      this.lastItemOnPage = e.totalItems;
  }

  updatePaginationInfo ()
  {
    this.firstItemOnPage = 1
    this.lastItemOnPage = this.firstItemOnPage + this.itemsPerPage - 1;
    if (this.lastItemOnPage > this.bookList.length)
      this.lastItemOnPage = this.bookList.length
  }
}
