import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Book } from 'src/app/models/book';
import { SearchModel } from 'src/app/models/search-model';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css']
})
export class BookDetailsComponent
{
  protected book: Book = new Book();
  protected inCategory: Book[] = [];
  protected fromAuthor: Book[] = [];
  protected fromPublisher: Book[] = [];

  constructor(private httpService: HttpService, private route: ActivatedRoute)
  {
    const id = this.route.snapshot.paramMap.get('id') || '';

    this.httpService.getBooks(id).subscribe(book =>
    {
      this.book = new Book(book.id, book.title, book.category.name, book.image, book.author.name, book.publisher.name, book.publishDate, book.overview, book.numberOfPages)
    });

    const categorySearch = new SearchModel(null, [this.book.category], null, null, null, null);
    const authorSearch = new SearchModel(null, null, this.book.author, null, null, null);
    const publisherSearch = new SearchModel(null, null, null, this.book?.publisher, null, null);
    this.httpService.searchBooks(categorySearch).subscribe(books => this.inCategory = books.map((book: any) => new Book(book.id, book.title, book.category.name, book.image, book.author.name, book.publisher.name, book.publishDate, book.overview, book.numberOfPages)));
    this.httpService.searchBooks(authorSearch).subscribe(books => this.fromAuthor = books.map((book: any) => new Book(book.id, book.title, book.category.name, book.image, book.author.name, book.publisher.name, book.publishDate, book.overview, book.numberOfPages)));
    this.httpService.searchBooks(publisherSearch).subscribe(books => this.fromPublisher = books.map((book: any) => new Book(book.id, book.title, book.category.name, book.image, book.author.name, book.publisher.name, book.publishDate, book.overview, book.numberOfPages)));
  }
}
