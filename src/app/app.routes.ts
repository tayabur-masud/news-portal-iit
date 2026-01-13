import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { NewsListComponent } from './components/news-list/news-list.component';
import { NewsCreateComponent } from './components/news-create/news-create.component';
import { NewsDetailComponent } from './components/news-detail/news-detail.component';
import { NewsEditComponent } from './components/news-edit/news-edit.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'news', component: NewsListComponent, canActivate: [authGuard] },
  { path: 'news/create', component: NewsCreateComponent, canActivate: [authGuard] },
  { path: 'news/:id', component: NewsDetailComponent, canActivate: [authGuard] },
  { path: 'news/edit/:id', component: NewsEditComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'news' }
];
