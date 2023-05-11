import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BookDetailsComponent } from './components/book-details/book-details.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { MainLayoutComponent } from './components/layouts/main-layout/main-layout.component';
import { HomeComponent } from './components/home/home.component';
import { BookComponent } from './components/book/book.component';
import { BookScrollListComponent } from './components/book-scroll-list/book-scroll-list.component';

import { SlickCarouselModule } from 'ngx-slick-carousel';
import { BookSearchComponent } from './components/book-search/book-search.component';

@NgModule({
  declarations: [
    AppComponent,
    BookDetailsComponent,
    LoginComponent,
    RegisterComponent,
    PageNotFoundComponent,
    MainLayoutComponent,
    HomeComponent,
    BookComponent,
    BookScrollListComponent,
    BookSearchComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    SlickCarouselModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
