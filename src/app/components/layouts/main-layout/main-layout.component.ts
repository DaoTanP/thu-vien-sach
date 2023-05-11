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
  protected isDark: boolean = false;
  constructor(private dataService: DataService)
  {
    this.switchThemeFunction = this.dataService.getData('themeSwitch');
  }

  toggleTheme ()
  {
    if (this.switchThemeFunction)
      this.isDark = this.switchThemeFunction();

  }
}
