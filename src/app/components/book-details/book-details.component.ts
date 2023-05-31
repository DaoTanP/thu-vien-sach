import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Book } from 'src/app/models/book';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css']
})
export class BookDetailsComponent
{
  protected book: Book | undefined;
  // protected book: Observable<Book>;
  constructor(private httpService: HttpService, private route: ActivatedRoute)
  {
    const id = this.route.snapshot.paramMap.get('id') || '';

    this.httpService.getBooks(id).subscribe(books => books.forEach((b: Book | undefined) => this.book = b));
  }
}
