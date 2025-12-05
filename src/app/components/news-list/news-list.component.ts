import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { NewsService } from '../../services/news.service';
import { AuthService } from '../../services/auth.service';
import { UsersService } from '../../services/users.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-news-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NgxPaginationModule],
  templateUrl: './news-list.component.html',
  styleUrl: './news-list.component.css'
})
export class NewsListComponent implements OnInit {
  news: any[] = [];
  usersMap = new Map<number, string>();
  loggedUser: any | null = null;

  searchText = '';
  page = 1;

  constructor(
    private newsService: NewsService,
    private usersService: UsersService,
    private auth: AuthService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loggedUser = this.auth.getLoggedUser();

    // Load users first, then news — ensures users map is populated before rendering
    forkJoin([
      this.usersService.getAll(),
      this.newsService.getAll()
    ]).subscribe({
      next: ([users, newsData]) => {
        if (users) {
          users.forEach(u => this.usersMap.set(Number(u.id), u.name));
        }
        this.news = newsData || [];
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Failed to load data:', err);
        this.news = [];
      }
    });
  }

  getAuthorName(authorId: number): string {
    return this.usersMap.get(Number(authorId)) || 'Unknown';
  }

  filteredNews(): any[] {
    if (!this.news) return [];
    return this.news.filter(n => n.title && n.title.toLowerCase().includes(this.searchText.toLowerCase()));
  }

  canEdit(item: any): boolean {
    return this.loggedUser && Number(item.author_id) === Number(this.loggedUser.id);
  }

  delete(id: number): void {
    if (!this.loggedUser) {
      alert('Please login first.');
      return;
    }
    const item = this.news.find(n => n.id === id);
    if (item && !this.canEdit(item)) {
      alert('You cannot delete this news.');
      return;
    }
    if (confirm('Are you sure you want to delete this news?')) {
      this.newsService.delete(id).subscribe(() => {
        this.news = this.news.filter(n => n.id !== id);
      });
    }
  }
}
