import { DOCUMENT } from '@angular/common';
import { Component } from '@angular/core';
import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent
{
  title = 'thu-vien';

  constructor(private dataService: DataService)
  {
    this.dataService.setData("themeSwitch", this.switchTheme);
  }
  switchTheme ()
  {
    document.body.classList.toggle("theme-dark");
  }
}
