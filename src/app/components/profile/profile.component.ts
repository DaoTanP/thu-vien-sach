import { Component } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { convertCSToReadableDate, convertJSToCSDate, convertToJSDate } from 'src/app/models/Utils';
import { Book } from 'src/app/models/book';
import { User } from 'src/app/models/user';
import { AlertService, AlertType } from 'src/app/services/alert.service';
import { AuthGuardService } from 'src/app/services/auth-guard.service';
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
  protected favoriteAsync: any;

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

  constructor(private dataService: DataService, private authGuard: AuthGuardService, private httpService: HttpService, private alertService: AlertService, private router: Router)
  {
    if (!authGuard.isLoggedIn)
      router.navigate(['/login']);

    this.setData();

    this.dataService.setData("navigateAfterLogOut", this.logOut);
  }

  setData ()
  {
    this.waiting = true;
    this.authGuard.userData.subscribe(data =>
    {
      this.user.value = data;
      this.userToEdit.value = data;

      const { id, username, password, avatarImage, favoriteBooks, cardNumber, cardPassword, ...userInfo } = data;
      this.editInfoForm.setValue({ ...userInfo });
      this.dateOfBirth.setValue(convertToJSDate(convertCSToReadableDate(data.dateOfBirth)));

      this.getFavorite();
      this.waiting = false;
    });
  }

  getFavorite ()
  {
    // this.user.favoriteBooks.forEach((b: any) =>
    // {
    //   this.httpService.getBooks(b.bookId).subscribe((book: any) =>
    //   {
    //     this.favorites.push(new Book(book.id, book.title,
    //       book.category.name, book.image,
    //       book.author.name, book.publisher.name,
    //       book.publishDate, book.overview, book.numberOfPages));
    //   }
    //   );
    // });
    this.waiting = true;
    this.favoriteAsync = this.httpService.getFavorite(this.user.id).pipe(map((books: Book[]) => books.map((book: any) => new Book(book.id, book.title, book.category.name, book.image, book.author.name, book.publisher.name, book.publishDate, book.overview, book.numberOfPages))));
    this.favoriteAsync.subscribe((books: any) => this.favorites = books);
  }

  submitChange ()
  {
    this.userToEdit = { ...this.userToEdit, ...this.editInfoForm.value };
  }

  change ()
  {
    this.waiting = true;
    if (this.userToEdit.dateOfBirth)
    {
      this.userToEdit.dateOfBirth = convertJSToCSDate(this.userToEdit.dateOfBirth);
    }

    this.httpService.editUser(this.userToEdit).subscribe({
      next: res =>
      {
        this.waiting = false;
        this.setData();
        this.userToEdit.password = '';
        this.alertService.appendAlert('Cập nhật thông tin thành công', AlertType.success, 5, 'alert-container');
      }, error: err =>
      {
        this.waiting = false;
        this.userToEdit.password = '';
        switch (err.status)
        {
          case 400:
          case 409:
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

  delete ()
  {
    this.waiting = true;
    this.httpService.deleteUser(this.userToEdit).subscribe({
      next: res =>
      {
        this.waiting = false;
        this.authGuard.logOut();
        this.logOut(this.router);
        this.alertService.appendAlert('Xóa tài khoản thành công', AlertType.success, 5, 'alert-container');
      }, error: err =>
      {
        this.waiting = false;
        this.userToEdit.password = '';
        switch (err.status)
        {
          case 404:
            this.alertService.appendAlert('Tài khoản không tồn tại', AlertType.danger, 5, 'alert-container');
            break;

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
          // this.authGuard.userData = this.user;
          this.alertService.appendAlert('Đổi ảnh đại diện thành công, tải lại trang để xem thay đổi', AlertType.success, 5, 'alert-container');
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
