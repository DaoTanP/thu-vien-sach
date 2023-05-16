import { Component, Input } from '@angular/core';
import { Book } from 'src/app/models/book';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent
{
  @Input() book: Book = new Book();
  @Input() href: string | undefined = undefined;
  @Input() hrefTitle: string = 'view details ->';
}
