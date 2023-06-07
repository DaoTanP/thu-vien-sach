import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Book } from 'src/app/models/book';
import { SearchModel } from 'src/app/models/search-model';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-book-search',
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.css']
})
export class BookSearchComponent
{
  protected searchModel: SearchModel = new SearchModel();
  protected displayStyleHorizontal: boolean = false;
  protected pageNumber: number | undefined = undefined;
  protected categories: Observable<any[]> = of([]);

  bookListAsync: Observable<Book[]> = of([]);
  protected bookList: Book[] = [];
  protected firstItemOnPage: number = 0;
  protected lastItemOnPage: number = 0;
  protected totalItems: number = 0;
  protected itemsPerPage: number = 0;

  protected searchForm: FormGroup = new FormGroup({
    bookTitle: new FormControl(null),
    categories: new FormArray([]),
    author: new FormControl(null),
    publisher: new FormControl(null),
    publishedFrom: new FormControl(null),
    publishedTo: new FormControl(null),
  });

  constructor(private httpService: HttpService, private router: Router, private route: ActivatedRoute)
  {
    // this.route.queryParams
    this.route.queryParamMap.subscribe(params =>
    {
      this.pageNumber = Number.parseInt(params.get('p') || '');
      let hasParams = false;
      let changed = false;
      hasParams = Object.keys(params).some(param => param !== 'p');
      if (!hasParams)
      {
        this.bookListAsync = this.httpService.searchBooks(this.searchModel);
        this.getList();
        return;
      }

      const sm = new SearchModel(params.get('q'), params.getAll('c'), params.get('a'), params.get('pub'), params.get('pf'), params.get('pt'));
      for (const key in sm)
      {
        if (this.searchModel[key] !== sm[key])
        {
          this.searchModel[key] = sm[key];
          changed = true;
        }
      }

      if (changed)
      {
        this.bookListAsync = this.httpService.searchBooks({ ...this.searchModel });
        this.getList();
      }
    });

    const { category, ...formValue } = this.searchModel;
    this.searchForm.patchValue(formValue);

    this.categories = httpService.getBookCategories();
  }

  reset ()
  {
    this.router.navigate(['/search']);
  }

  getList ()
  {
    this.bookListAsync.subscribe(books =>
    {
      this.bookList = books.map((book: any) => new Book(book.id, book.title, book.category.name, book.image, book.author.name, book.publisher.name, book.publishDate, book.overview, book.numberOfPages));

      this.totalItems = books.length;
      this.resetPaginationInfo();
    });
  }

  search ()
  {
    let query = this.searchForm.value;

    console.log(query.categories);

    const queryParams = {
      q: query.bookTitle,
      c: query.categories,
      a: query.author,
      pub: query.publisher,
      pf: query.publishedFrom,
      pt: query.publishedTo,
      p: 1,
    }

    this.router.navigate(['/search'], { queryParams: queryParams });
  }

  onCategoryCheckboxChange (event: any)
  {
    const selectedCategories = (this.searchForm.get('categories') as FormArray);
    if (event.target.checked)
    {
      selectedCategories.push(new FormControl(event.target.value));
    } else
    {
      const index = selectedCategories.controls.findIndex(x => x.value === event.target.value);
      selectedCategories.removeAt(index);
    }
  }

  onChangePage (e: any)
  {
    this.router.navigate(['/search'], { queryParams: { p: e.currentPage }, queryParamsHandling: 'merge' })
  }

  getPaginationInfo (e: any)
  {
    if (e.currentPage > e.totalPages)
      e.currentPage = e.totalPages;
    this.firstItemOnPage = (e.currentPage - 1) * e.itemsPerPage + 1;
    this.itemsPerPage = e.itemsPerPage;
    this.lastItemOnPage = e.currentPage * this.itemsPerPage;
    this.totalItems = e.totalItems;
    if (this.lastItemOnPage > this.totalItems)
      this.lastItemOnPage = this.totalItems;

    if (this.pageNumber && this.pageNumber > e.totalPages)
    {
      this.pageNumber = e.totalPages;
      this.router.navigate(['/search'], { queryParams: { p: this.pageNumber }, queryParamsHandling: 'merge' })
    }
  }

  resetPaginationInfo ()
  {
    this.firstItemOnPage = 1
    this.lastItemOnPage = this.itemsPerPage;
    if (this.lastItemOnPage > this.totalItems)
      this.lastItemOnPage = this.totalItems
  }
}
