import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  protected firstName: FormControl = new FormControl(null, [Validators.required, Validators.minLength(3)]);
  protected lastName: FormControl = new FormControl(null, [Validators.required, Validators.minLength(3)]);
  protected username: FormControl = new FormControl(null, [Validators.required, Validators.minLength(3)]);
  protected email: FormControl = new FormControl(null, [Validators.required, Validators.email]);
  protected password: FormControl = new FormControl(null, [Validators.required, Validators.minLength(8)]);

  public registerForm: FormGroup = new FormGroup({
    firstName: this.firstName,
    lastName: this.lastName,
    username: this.username,
    email: this.email,
    password: this.password,
  });

  constructor(private httpService: HttpService, private router: Router) {}

  public register(): void {
    const username = this.registerForm.value.username || '';
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
