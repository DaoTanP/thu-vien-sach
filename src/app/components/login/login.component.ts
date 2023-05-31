import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent
{
  protected username: FormControl = new FormControl(null, [Validators.required, Validators.minLength(3)]);
  protected password: FormControl = new FormControl(null, [Validators.required, Validators.minLength(8)]);

  // protected formBuilder: FormBuilder = new FormBuilder();
  // protected loginForm: FormGroup = this.formBuilder.group({
  //   username: [null, [Validators.required, Validators.minLength(3)]],
  //   password: [null, [Validators.required, Validators.minLength(8)]],
  // });
  public loginForm: FormGroup = new FormGroup({
    username: this.username,
    password: this.password,
  });
  constructor(private httpService: HttpService, private router: Router)
  {

  }

  public login (): void
  {
    const username = this.loginForm.value.username || '';
    const password = this.loginForm.value.password || '';
    this.httpService.authenticate(username, password).subscribe(res =>
    {
      if (res.status === 200)
      {
        this.router.navigate(['home']);
      }
    })
  }
}
