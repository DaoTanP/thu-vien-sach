import { Component } from '@angular/core';
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
  protected numberOfResults: number = 0;

  constructor(private bookService: BookService)
  {

  }

  search (query: string)
  {
    this.bookList = this.bookService.search(query);
    this.numberOfResults = this.bookList.length;
  }
}
