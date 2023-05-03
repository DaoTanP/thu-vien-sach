import { Component } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent
{
  protected switchThemeFunction: any = undefined;
  constructor(private dataService: DataService)
  {
    this.switchThemeFunction = this.dataService.getData('themeSwitch');
    console.log(this.dataService.getData('themeSwitch'));
  }

  toggleTheme ()
  {
    if (this.switchThemeFunction)
      this.switchThemeFunction();
  }
}
