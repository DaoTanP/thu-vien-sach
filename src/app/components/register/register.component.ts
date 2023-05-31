import { Component } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, map, of } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent
{
  protected waiting: boolean = false;

  protected displayName: FormControl = new FormControl(null, [Validators.required, Validators.minLength(5)]);
  protected username: FormControl = new FormControl(null, { updateOn: 'blur', validators: [Validators.required, Validators.minLength(5)], asyncValidators: this.usernameExistValidator() });
  protected password: FormControl = new FormControl(null, [Validators.required, Validators.minLength(8)]);
  protected confirmPassword: FormControl = new FormControl(null, [Validators.required, this.matchValidator(this.password)]);
  protected agreement: FormControl = new FormControl(false);

  public registerForm: FormGroup = new FormGroup({
    displayName: this.displayName,
    username: this.username,
    password: this.password,
    confirmPassword: this.confirmPassword,
    agreement: this.agreement
  });

  constructor(private httpService: HttpService, private dataService: DataService, private router: Router) { }

  public matchValidator (controlToMatch: AbstractControl<any, any>): ValidatorFn
  {
    return (control: AbstractControl<any, any>): ValidationErrors | null =>
    {
      return (control.value === controlToMatch.value) ? null : { notMatch: true };
    }
  }

  public usernameExistValidator (): AsyncValidatorFn
  {
    return (control: AbstractControl<any, any>): Observable<ValidationErrors | null> =>
    {
      if (!control.value)
      {
        return of(null);
      }

      return this.httpService.usernameExists(control.value).pipe(
        map(res =>
        {
          // console.log(res);
          return res ? { exists: true } : null;
        })
      );
    }
  }

  public register ()
  {
    this.clearAlert();
    this.waiting = true;
    const displayName = this.registerForm.value.displayName || '';
    const username = this.registerForm.value.username || '';
    const password = this.registerForm.value.password || '';
    this.httpService.register(displayName, username, password).subscribe({
      next: (res) =>
      {
        this.waiting = false;
        this.dataService.setSession('user', JSON.stringify(res));
        this.router.navigate(['home']);
        // console.log(res);
      }, error: (err) =>
      {
        this.waiting = false;
        switch (err.status)
        {
          case 409:
            this.appendAlert('Tên đăng nhập đã tồn tại');
            break;

          case 400:
            this.appendAlert('Thông tin không hợp lệ');
            break;

          case 0:
            this.appendAlert('Đã xảy ra sự cố với mạng');
            break;

          default:
            break;
        }
      }
    });
  }

  public appendAlert = (message: string, type: string = 'danger') =>
  {
    let alertPlaceholder = document.getElementById('form-wrapper');
    if (alertPlaceholder == null)
      return;

    const wrapper = document.createElement('div')
    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible m-0" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      '</div>'
    ].join('')

    alertPlaceholder.prepend(wrapper);
  }

  public clearAlert ()
  {
    let alertPlaceholder = document.getElementById('form-wrapper');
    if (alertPlaceholder == null)
      return;

    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(element =>
    {
      element.remove();
    });
  }
}
