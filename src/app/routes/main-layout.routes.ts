import { Routes } from "@angular/router";
import { HomeComponent } from "../components/home/home.component";
import { BookDetailsComponent } from "../components/book-details/book-details.component";

export const mainLayoutRoute: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'book', component: BookDetailsComponent },
    { path: 'book/:id', component: BookDetailsComponent },
]