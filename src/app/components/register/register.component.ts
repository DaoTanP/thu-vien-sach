import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent
{
  protected email: FormControl = new FormControl(null, [Validators.required, Validators.email]);
  protected password: FormControl = new FormControl(null, [Validators.required, Validators.minLength(8)]);
  protected confirmPassword: FormControl = new FormControl(null, [Validators.required, Validators.minLength(8)]);

  public registerForm: FormGroup = new FormGroup({
    email: this.email,
    password: this.password,
    confirmPassword: this.confirmPassword
  });

  constructor(private httpService: HttpService, private router: Router) { }

  public register (): void
  {
    const email = this.registerForm.value.email || '';
    const password = this.registerForm.value.password || '';
    // this.httpService.register(username, email, password).subscribe(res =>
    // {
    //   if (res.status === 200)
    //   {
    //     this.router.navigate(['login']);
    //   }
    // })
  }
}
