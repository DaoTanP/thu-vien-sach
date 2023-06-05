import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthGuardService } from 'src/app/services/auth-guard.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent
{
  protected switchThemeFunction: any = undefined;
  protected setThemeFunction: any = undefined;
  protected getThemeFunction: any = undefined;
  protected isDark: boolean = false;
  protected isScrolled: boolean = false;
  protected user: any;

  get isLoggedIn () { return this.authGuardService.isLoggedIn };

  constructor(private dataService: DataService, private authGuardService: AuthGuardService, private router: Router)
  {
    this.switchThemeFunction = this.dataService.getData('switchTheme');
    this.setThemeFunction = this.dataService.getData('setTheme');
    this.getThemeFunction = this.dataService.getData('getTheme');
    this.isDark = this.getTheme();

    const sessionData = this.dataService.getSession('user');
    if (typeof sessionData === 'string')
    {
      this.user = JSON.parse(sessionData);
      console.log(this.user);
    }
  }

  toggleTheme ()
  {
    this.switchThemeFunction();
    this.isDark = this.getTheme();
  }

  setTheme (theme: string)
  {
    this.setThemeFunction(theme);
    this.isDark = this.getTheme();
  }

  getTheme ()
  {
    return this.getThemeFunction() == 'dark' ? true : false;
  }

  @HostListener("window:scroll")
  scrollEvent ()
  {
    window.pageYOffset >= 20 ? (this.isScrolled = true) : (this.isScrolled = false);
  }

  logOut ()
  {
    this.dataService.removeSession('user');
    this.user = undefined;

    let navigateAfterLogOut = this.dataService.getData('navigateAfterLogOut');

    if (navigateAfterLogOut)
      navigateAfterLogOut(this.router);
  }
}
