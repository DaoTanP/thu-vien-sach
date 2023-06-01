import { Component } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent
{
  protected userInfo: any = undefined;

  protected firstName: FormControl = new FormControl(null, [Validators.required]);
  protected lastName: FormControl = new FormControl(null);
  protected dob: FormControl = new FormControl(null, [Validators.required]);

  public editInfoForm: FormGroup = new FormGroup({
    firstName: this.firstName,
    lastName: this.lastName,
    dob: this.dob,
  });

  constructor(private dataService: DataService, private router: Router)
  {
    const sessionData = this.dataService.getSession('user');
    if (!sessionData || typeof sessionData !== 'string')
    {
      router.navigate(['login']);
      return;
    }
    this.userInfo = JSON.parse(sessionData);
  }

  submitChange ()
  {

  }
}
