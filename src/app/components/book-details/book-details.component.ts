import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Book } from 'src/app/models/book';
import { BookService } from 'src/app/services/book.service';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css']
})
export class BookDetailsComponent
{
  protected book: Book | undefined;
  constructor(private bookService: BookService, private route: ActivatedRoute)
  {
    const id = this.route.snapshot.paramMap.get('id') || '';

    this.book = this.bookService.getById(id);
  }
}
