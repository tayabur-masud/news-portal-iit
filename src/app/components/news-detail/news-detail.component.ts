import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NewsService } from '../../services/news.service';
import { AuthService } from '../../services/auth.service';
import { UsersService } from '../../services/users.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-news-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './news-detail.component.html'
})
export class NewsDetailComponent implements OnInit {
  news: any;
  usersMap = new Map<number, string>();
  commentText = '';

  constructor(
    private route: ActivatedRoute,
    private newsService: NewsService,
    private usersService: UsersService,
    private auth: AuthService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) {
      console.error('No ID provided');
      return;
    }
    const id = +idParam;

    // Load users first, then news detail — ensures users map is populated before rendering
    forkJoin([
      this.usersService.getAll(),
      this.newsService.getById(id)
    ]).subscribe({
      next: ([users, newsData]) => {
        if (users) {
          users.forEach(u => this.usersMap.set(Number(u.id), u.name));
        }
        this.news = newsData;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Failed to load data:', err);
      }
    });
  }

  getAuthorName(authorId: number): string {
    return this.usersMap.get(Number(authorId)) || 'Unknown';
  }

  getUserName(userId: number): string {
    return this.usersMap.get(Number(userId)) || 'Unknown';
  }

  addComment(): void {
    if (!this.commentText.trim()) { alert('Comment text cannot be empty.'); return; }
    const user = this.auth.getLoggedUser();
    if (!user) { alert('Please login first.'); return; }

    const newComment = {
      id: Date.now(),
      text: this.commentText.trim(),
      user_id: user.id,
      timestamp: new Date().toISOString()
    };
    const updatedComments = [...(this.news.comments || []), newComment];

    this.newsService.update(this.news.id, { comments: updatedComments }).subscribe(() => {
      this.news.comments = updatedComments;
      this.commentText = '';
    });
  }
}
