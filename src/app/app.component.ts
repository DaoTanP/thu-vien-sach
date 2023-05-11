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
    let html = document.querySelector("html");
    if (!html)
      return;

    if (html.dataset['bsTheme'] == "light")
    {
      html.dataset['bsTheme'] = "dark";
      return true;
    }
    else
    {
      html.dataset['bsTheme'] = "light";
      return false;
    }
  }
}
