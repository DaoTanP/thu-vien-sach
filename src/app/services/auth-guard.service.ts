import { Injectable } from '@angular/core';
import
{
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { DataService } from '../services/data.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate
{
  constructor(private dataService: DataService, private router: Router) { }

  get isLoggedIn (): boolean
  {
    return (this.dataService.getSession('user') !== null);
  }

  canActivate (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean
  {
    if (!this.isLoggedIn)
    {
      this.router.navigate(['login']);
    }

    return this.isLoggedIn;
  }
}