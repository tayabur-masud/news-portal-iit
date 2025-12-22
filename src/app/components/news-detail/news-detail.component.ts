import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NewsService } from '../../services/news.service';
import { AuthService } from '../../services/auth.service';
import { UsersService } from '../../services/users.service';
import { forkJoin } from 'rxjs';
import { User } from '../../models/user.model';
import { News } from '../../models/news.model';
import { NewsComment } from '../../models/comment.model';
import { CommentsService } from '../../services/comments.service';

@Component({
  selector: 'app-news-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './news-detail.component.html'
})
export class NewsDetailComponent implements OnInit {
  news: News | null = null;
  usersMap = new Map<string, string>();
  commentText = '';

  constructor(
    private route: ActivatedRoute,
    private newsService: NewsService,
    private usersService: UsersService,
    private commentsService: CommentsService,
    private auth: AuthService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) {
      console.error('No ID provided');
      return;
    }
    const id = idParam;

    // Load users first, then news detail — ensures users map is populated before rendering
    forkJoin([
      this.usersService.getAll(),
      this.newsService.getById(id)
    ]).subscribe({
      next: ([users, newsData]) => {
        if (users) {
          users.forEach(u => this.usersMap.set(u.id, u.name));
        }
        this.news = newsData;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Failed to load data:', err);
      }
    });
  }

  getAuthorName(authorId: string | number): string {
    return this.usersMap.get(authorId.toString()) || 'Unknown';
  }

  getUserName(userId: string | number): string {
    return this.usersMap.get(userId.toString()) || 'Unknown';
  }

  addComment(): void {
    if (!this.commentText.trim()) { alert('Comment text cannot be empty.'); return; }
    const user = this.auth.getLoggedUser();
    if (!user || !this.news) { alert('Please login first.'); return; }

    const newComment: Partial<NewsComment> = {
      text: this.commentText.trim(),
      authorId: user.id,
      authorName: user.name,
      newsId: this.news.id,
      createdAt: new Date().toISOString()
    };

    this.commentsService.create(newComment).subscribe((savedComment: NewsComment) => {
      if (this.news) {
        this.news.comments = [...(this.news.comments || []), savedComment];
        this.news.noOfComments = (this.news.noOfComments || 0) + 1;
      }
      this.commentText = '';
    });
  }
}
