import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { NewsService } from '../../services/news.service';
import { AuthService } from '../../services/auth.service';
import { UsersService } from '../../services/users.service';
import { forkJoin } from 'rxjs';
import { User } from '../../models/user.model';
import { News } from '../../models/news.model';

@Component({
  selector: 'app-news-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NgxPaginationModule],
  templateUrl: './news-list.component.html',
  styleUrl: './news-list.component.css'
})
export class NewsListComponent implements OnInit {
  _news: News[] = [];
  usersMap = new Map<string, string>();
  loggedUser: User | null = null;

  _searchText = '';
  page = 1;
  limit = 2;
  totalItems = 0;

  get searchText(): string {
    return this._searchText;
  }

  set searchText(value: string) {
    this._searchText = value;
    this.page = 1; // Reset to first page on search
    this.loadNews();
  }

  constructor(
    private newsService: NewsService,
    private usersService: UsersService,
    private auth: AuthService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loggedUser = this.auth.getLoggedUser();

    // Load users first, then initial news
    this.usersService.getAll().subscribe({
      next: (users) => {
        if (users) {
          users.forEach(u => this.usersMap.set(u.id, u.name));
        }
        this.loadNews();
      },
      error: (err) => console.error('Failed to load users:', err)
    });
  }

  loadNews(): void {
    this.newsService.getAllWithPagination(this.page, this.limit, this.searchText).subscribe({
      next: (resp) => {
        this._news = resp.items || [];
        this.totalItems = resp.totalCount || 0;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Failed to load news:', err);
        this._news = [];
        this.totalItems = 0;
      }
    });
  }

  onPageChange(page: number): void {
    this.page = page;
    this.loadNews();
  }

  getAuthorName(authorId: string | number): string {
    return this.usersMap.get(authorId.toString()) || 'Unknown';
  }

  canEdit(item: News): boolean {
    return this.loggedUser !== null && item.authorId.toString() === this.loggedUser.id.toString();
  }

  delete(id: string): void {
    if (!this.loggedUser) {
      alert('Please login first.');
      return;
    }
    const item = this._news.find(n => n.id.toString() === id.toString());
    if (item && !this.canEdit(item)) {
      alert('You cannot delete this news.');
      return;
    }
    if (confirm('Are you sure you want to delete this news?')) {
      this.newsService.delete(id).subscribe(() => {
        this._news = this._news.filter(n => n.id.toString() !== id.toString());
        this.loadNews(); // Reload to refresh pagination
      });
    }
  }
}
