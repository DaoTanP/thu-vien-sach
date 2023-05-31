import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent
{
  protected waiting: boolean = false;

  protected username: FormControl = new FormControl(null, [Validators.required, Validators.minLength(5)]);
  protected password: FormControl = new FormControl(null, [Validators.required, Validators.minLength(8)]);

  public loginForm: FormGroup = new FormGroup({
    username: this.username,
    password: this.password,
  });
  constructor(private httpService: HttpService, private dataService: DataService, private router: Router)
  {

  }

  public login (): void
  {
    this.clearAlert();
    this.waiting = true;

    const username = this.loginForm.value.username || '';
    const password = this.loginForm.value.password || '';
    this.httpService.login(username, password).subscribe({
      next: res =>
      {
        this.waiting = false;
        this.dataService.setSession('user', JSON.stringify(res));
        this.router.navigate(['home']);
      }, error: err =>
      {
        this.waiting = false;
        switch (err.status)
        {
          case 404:
            this.appendAlert('Tài khoản không tồn tại, kiểm tra lại tên đăng nhập hoặc mật khẩu');
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

    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible mb-2`;
    alert.role = 'alert';
    alert.innerHTML = [
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    ].join('');

    alertPlaceholder.prepend(alert);
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
