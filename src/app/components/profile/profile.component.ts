import { Component } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Book } from 'src/app/models/book';
import { User } from 'src/app/models/user';
import { AlertService, AlertType } from 'src/app/services/alert.service';
import { DataService } from 'src/app/services/data.service';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent
{
  protected waiting: boolean = false;
  protected user: User = new User();
  protected userToEdit: User = new User();
  protected favorites: Book[] = [];

  protected firstName: FormControl = new FormControl(null, [Validators.required]);
  protected lastName: FormControl = new FormControl(null);
  protected dateOfBirth: FormControl = new FormControl(null);
  protected gender: FormControl = new FormControl(null);
  protected phoneNumber: FormControl = new FormControl(null);
  protected email: FormControl = new FormControl(null);
  protected address: FormControl = new FormControl(null);

  public editInfoForm: FormGroup = new FormGroup({
    firstName: this.firstName,
    lastName: this.lastName,
    dateOfBirth: this.dateOfBirth,
    gender: this.gender,
    phoneNumber: this.phoneNumber,
    email: this.email,
    address: this.address,
  });

  constructor(private dataService: DataService, private httpService: HttpService, private alertService: AlertService, private router: Router)
  {
    const sessionData = this.dataService.getSession('user');
    if (!sessionData || typeof sessionData !== 'string')
      return;
    this.user.value = JSON.parse(sessionData);
    this.dataService.setData("navigateAfterLogOut", this.logOut);
    this.favorites = this.user.favoriteBooks.map((object: any) =>
    {
      const book = object.book;
      return new Book(book.id, book.title,
        book.category.name, book.image,
        book.author.name, book.publisher.name,
        book.publishDate, book.overview, book.numberOfPages);
    })

    this.userToEdit.value = this.user;
    const { id, username, password, avatarImage, favoriteBooks, cardNumber, cardPassword, ...userInfo } = this.userToEdit;

    this.editInfoForm.setValue({ ...userInfo });

    const dob = (this.user.dateOfBirth || '');
    console.log(this.user.dateOfBirth);

    var pattern = /(\d{2})\/(\d{1,2})\/(\d{4})/;
    var dt = new Date(dob.replace(pattern, '$3-$2-$1'));

    const date = dt.toISOString().substring(0, 10);
    this.dateOfBirth.setValue(date);
  }

  submitChange ()
  {
    this.userToEdit = { ...this.userToEdit, ...this.editInfoForm.value };
  }

  change ()
  {
    this.waiting = true;
    const { id, avatarImage, favoriteBooks, cardNumber, cardPassword, ...userInfo } = this.userToEdit;
    let change = { ...this.user, ...userInfo };
    change.password = this.user.password;
    if (change.dateOfBirth)
    {
      change.dateOfBirth = `/Date(${Date.parse(change.dateOfBirth)}+0700)/`;
    }
    console.log(change);

    this.httpService.editUser(change).subscribe({
      next: res =>
      {
        this.waiting = false;
        this.dataService.setSession('user', JSON.stringify(res));
        this.user.value = res;
        this.alertService.appendAlert('Cập nhật thông tin thành công', AlertType.success, 5, 'alert-container');
      }, error: err =>
      {
        this.waiting = false;
        switch (err.status)
        {
          case 400:
          case 409:
            this.alertService.appendAlert('Thông tin không hợp lệ, vui lòng kiểm tra lại', AlertType.danger, 5, 'alert-container');
            break;

          case 0:
            this.alertService.appendAlert('Đã xảy ra sự cố với mạng, vui lòng thử lại sau', AlertType.danger, 5, 'alert-container');
            break;

          default:
            this.alertService.appendAlert('Đã xảy ra lỗi, vui lòng thử lại sau', AlertType.danger, 5, 'alert-container');
            break;
        }
      }
    });
  }

  delete ()
  {
    this.waiting = true;
    this.httpService.deleteUser(this.user).subscribe({
      next: res =>
      {
        this.waiting = false;
        this.dataService.removeSession('user');
        this.logOut(this.router);
        this.alertService.appendAlert('Xóa tài khoản thành công', AlertType.success, 5, 'alert-container');
      }, error: err =>
      {
        this.waiting = false;
        switch (err.status)
        {
          case 404:
            this.alertService.appendAlert('Tài khoản không tồn tại', AlertType.danger, 5, 'alert-container');
            break;

          case 400:
            this.alertService.appendAlert('Thông tin không hợp lệ, vui lòng kiểm tra lại', AlertType.danger, 5, 'alert-container');
            break;

          case 0:
            this.alertService.appendAlert('Đã xảy ra sự cố với mạng, vui lòng thử lại sau', AlertType.danger, 5, 'alert-container');
            break;

          default:
            this.alertService.appendAlert('Đã xảy ra lỗi, vui lòng thử lại sau', AlertType.danger, 5, 'alert-container');
            break;
        }
      }
    });
  }

  uploadAvatar (inputEvent: any)
  {
    const file = inputEvent.target.files[0];
    const r = new FileReader();
    this.waiting = true;
    r.onloadend = (e) =>
    {
      if (!e.target || !e.target.result || 'string' === typeof e.target.result)
        return;

      const arr = Array.from(new Uint8Array(e.target.result));

      const uploadData = {
        username: this.user.username,
        imageBytes: arr,
      }

      this.httpService.uploadAvatar(uploadData).subscribe({
        next: res =>
        {
          this.waiting = false;
          this.user.avatarImage = res;
          this.dataService.setSession('user', JSON.stringify(this.user));
        },
        error: err =>
        {
          this.waiting = false;
          switch (err.status)
          {
            case 0:
              this.alertService.appendAlert('Không thể kết nối với máy chủ, vui lòng thử lại sau', AlertType.danger, 5, 'alert-container');
              break;

            default:
              this.alertService.appendAlert('Đã xảy ra lỗi, vui lòng thử lại sau', AlertType.danger, 5, 'alert-container');
              break;
          }
        }
      });
    }

    r.readAsArrayBuffer(file);
  }

  changePassword (oldPassword: string, newPassword: string)
  {
    if (!oldPassword || !newPassword || oldPassword === newPassword)
      return;

    const data = {
      username: this.user.username,
      oldPassword: oldPassword,
      newPassword: newPassword,
    };

    this.waiting = true;

    this.httpService.changeUserPassword(data).subscribe({
      next: res =>
      {
        this.waiting = false;
        this.alertService.appendAlert('Thay đổi mật khẩu thành công', AlertType.success, 5, 'alert-container');
      }, error: err =>
      {
        this.waiting = false;
        switch (err.status)
        {
          case 400:
            this.alertService.appendAlert('Thông tin không hợp lệ, vui lòng kiểm tra lại', AlertType.danger, 5, 'alert-container');
            break;

          case 0:
            this.alertService.appendAlert('Không thể kết nối với máy chủ, vui lòng thử lại sau', AlertType.danger, 5, 'alert-container');
            break;

          default:
            this.alertService.appendAlert('Đã xảy ra lỗi, vui lòng thử lại sau', AlertType.danger, 5, 'alert-container');
            break;
        }
      }
    });
  }

  logOut (router: Router)
  {
    router.navigate(['home']);
  }
}
