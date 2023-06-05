import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent
{
  protected searchInput: string = '';

  constructor(private router: Router) { }

  search ()
  {
    if (!this.searchInput || this.searchInput === '')
      return;

    this.router.navigate(['/search'], { queryParams: { q: this.searchInput } });
  }
}
