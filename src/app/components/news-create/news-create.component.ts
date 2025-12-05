import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NewsService } from '../../services/news.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-news-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './news-create.component.html',
  styleUrls: []
})
export class NewsCreateComponent {
  title = '';
  body = '';

  constructor(private newsService: NewsService, private auth: AuthService, private router: Router) { }

  create(): void {
    if (!this.title.trim()) { alert('Title cannot be empty.'); return; }
    if ((this.body || '').trim().length < 20) { alert('Body must be at least 20 characters.'); return; }
    const user = this.auth.getLoggedUser();
    if (!user) { alert('Please login first.'); return; }

    const payload = {
      title: this.title.trim(),
      body: this.body.trim(),
      author_id: Number(user.id),
      comments: []
    };
    this.newsService.create(payload).subscribe(() => this.router.navigate(['/news']));
  }
}
