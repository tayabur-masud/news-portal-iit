import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NewsService } from '../../services/news.service';
import { AuthService } from '../../services/auth.service';
import { News } from '../../models/news.model';

@Component({
  selector: 'app-news-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './news-edit.component.html'
})
export class NewsEditComponent implements OnInit {
  news: News | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private newsService: NewsService,
    private auth: AuthService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.newsService.getById(id).subscribe({
      next: (data) => {
        console.log('Edit News - ID:', id);
        console.log('Edit News - Fetched Data:', data);
        const user = this.auth.getLoggedUser();
        console.log('Edit News - Logged User:', user);

        if (!user || data.authorId.toString() !== user.id.toString()) {
          console.warn('Edit News - Unauthorized:', { author: data.authorId, user: user?.id });
          alert('You cannot edit this news!');
          this.router.navigate(['/news']);
          return;
        }
        this.news = data;
        console.log('Edit News - News Object Set:', this.news);
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Edit News - Failed to load:', err)
    });
  }

  save(): void {
    if (!this.news) return;
    if (!this.news.title.trim()) { alert('Title cannot be empty.'); return; }
    if ((this.news.body || '').trim().length < 20) { alert('Body must be at least 20 characters.'); return; }
    this.newsService.update(this.news.id, { title: this.news.title.trim(), body: this.news.body.trim() })
      .subscribe(() => this.router.navigate(['/news']));
  }
}
